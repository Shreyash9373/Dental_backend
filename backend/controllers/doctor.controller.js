import cookieOptions from "../constants.js";
import DoctorModel from "../models/doctor.model.js";
import ReceptionistModel from "../models/receptionist.model.js";
import { genAccessAndRefreshTokens } from "../services/auth.service.js";
import { ResponseError } from "../utils/error.js";

const doctorLogin = async (req, res) => {
  // check email and password
  const { email, password } = req.body;
  if (!email || !password)
    throw new ResponseError(400, "Email and password required");

  //   check for admin
  const existingDoctor = await DoctorModel.findOne({ email });
  if (!existingDoctor)
    throw new ResponseError(
      404,
      "Invalid credentials or doctor does not exists"
    );

  // validate payload
  const hasValidPassword = await existingDoctor.isPasswordCorrect(password);
  if (!hasValidPassword)
    throw new ResponseError(
      400,
      "Invalid credentials or doctor does not exists"
    );

  // create access and refresh tokens
  const { accessToken, refreshToken } = await genAccessAndRefreshTokens(
    existingDoctor
  );

  // Cookie options
  const accessTokenOptions = cookieOptions("access");
  const refreshTokenOptions = cookieOptions("refresh");
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json({
      success: true,
      doctor: {
        name: existingDoctor.name,
        email: existingDoctor.email,
      },
      accessToken,
      refreshToken,
      message: "Logged in successfully",
    });
};

const doctorRegister = async (req, res) => {
  // check for name, email and password
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    throw new ResponseError(400, "Invalid data");

  // check for existing doctor
  const existingDoctor = await DoctorModel.findOne({ email });
  if (existingDoctor)
    throw new ResponseError(400, "This email is already registered");

  // create doctor
  const doctor = await DoctorModel.create({
    name,
    email,
    password,
  });
  // doctor.password = undefined;

  return res.status(201).json({
    success: true,
    doctor,
    message: "Doctor registered successfully",
  });
};

const doctorLogout = async (req, res) => {
  const doctorId = req.doctor._id;

  //   unset refreshToken
  await DoctorModel.findByIdAndUpdate(
    doctorId,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  // clear cookies
  const accessTokenOptions = cookieOptions("access");
  const refreshTokenOptions = cookieOptions("refresh");
  return res
    .status(200)
    .clearCookie("accessToken", accessTokenOptions)
    .clearCookie("refreshToken", refreshTokenOptions)
    .json({ success: true, msg: "Logged out successfully" });
};

const changeDoctorPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ResponseError(400, "Invalid email or password");

  const doctor = await DoctorModel.findOne({ email });
  if (!doctor)
    throw new ResponseError(
      400,
      "Invalid credentials or doctor does not exists"
    );

  doctor.password = password;
  const response = await doctor.save({ validateBeforeSave: false });
  // const response = await doctor.save();
  if (response) {
    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } else throw new ResponseError(400, "Unable to change password");
};

const addReceptionist = async (req, res) => {
  const { name, email, password } = req.body;

  // validate payload
  if (!name || !email || !password)
    throw new ResponseError(400, "Name, email and password required");

  // check for existing receptionist
  const existingReceptionist = await ReceptionistModel.findOne({ email });
  if (existingReceptionist)
    throw new ResponseError(400, "This email is already registered");

  // add receptionist to db
  const receptionist = await ReceptionistModel.create({
    name,
    email,
    password,
  });
  return res.status(201).json({
    success: true,
    msg: "Receptionist registered successfully",
  });
};

const changeReceptionistPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ResponseError(400, "Invalid email or password");

  const receptionist = await ReceptionistModel.findOne({ email });
  if (!receptionist)
    throw new ResponseError(
      400,
      "Invalid credentials or receptionist does not exists"
    );

  receptionist.password = password;
  // const response = await receptionist.save({ validateBeforeSave: false });
  const response = await receptionist.save();
  if (response) {
    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } else throw new ResponseError(400, "Unable to change password");
};

export {
  doctorLogin,
  doctorRegister,
  doctorLogout,
  changeDoctorPassword,
  addReceptionist,
  changeReceptionistPassword,
};
