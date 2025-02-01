import PatientModel from "../models/patient.model.js";
import { ResponseError } from "../utils/error.js";

const addPatient = async (req, res) => {
  const { name, mobile, age, email } = req.body;

  if (!name || !mobile || !age)
    throw new ResponseError(400, "Name, Mobile and age required!");

  const existingPatient = await PatientModel.findOne({ mobile });

  if (existingPatient)
    throw new ResponseError(409, "This mobile number is already registered!");

  const patient = await PatientModel.create({
    name,
    mobile,
    age,
    email,
  });

  return res.status(201).json({
    success: true,
    msg: "Patient added successfully",
    patient,
  });
};

const getPatient = async (req, res) => {
  const { prn } = req.params;

  if (!prn) throw new ResponseError(404, "No patient with given PRN");

  const patient = await PatientModel.findOne({ prn });

  return res.status(200).json({
    success: true,
    patient,
  });
};

const searchPatient = async (req, res) => {
  const { name, mobile, email } = req.query;
  // console.log(
  //   mobile
  //     .split("")
  //     .map((char) => `(?=.*${char})`)
  //     .join("")
  // );
  // console.log(RegExp(`(?=.*${mobile.split("").join(".*")})`));

  let filteredPatients = [];
  /* const filteredPatients = await PatientModel.find({
    $or: [
      { name: RegExp(name, "i") },
      {
        mobile: RegExp(
          mobile
            .split("")
            .map((char) => `(?=.*${char})`)
            .join(""),
          "i"
        ),
      },
      { email: RegExp(email, "i") },
    ],
  }); */
  if (name || email)
    filteredPatients = await PatientModel.find({
      $text: { $search: name ? name : email ? email : mobile },
    });
  else
    filteredPatients = await PatientModel.find({
      mobile: {
        $regex: RegExp(`(?=.*${mobile.split("").join(".*")})`),
      },
    });

  return res.status(200).json({
    success: true,
    patients: filteredPatients,
  });
};

export { addPatient, getPatient, searchPatient };
