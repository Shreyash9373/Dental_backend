import jwt from "jsonwebtoken";

import cookieOptions from "../constants.js";
import ReceptionistModel from "../models/receptionist.model.js";
import { genAccessAndRefreshTokens } from "../services/auth.service.js";
import { ResponseError } from "../utils/error.js";

const receptionistLogin = async (req, res) => {
  // check email and password
  const { email, password } = req.body;
  if (!email || !password)
    throw new ResponseError(400, "Email and password required");

  //   check for admin
  const existingReceptionist = await ReceptionistModel.findOne({ email });
  if (!existingReceptionist)
    throw new ResponseError(
      404,
      "Invalid credentials or receptionist does not exists"
    );

  // validate payload
  const hasValidPassword = await existingReceptionist.isPasswordCorrect(
    password
  );
  if (!hasValidPassword)
    throw new ResponseError(
      400,
      "Invalid credentials or receptionist does not exists"
    );

  // create access and refresh tokens
  const { accessToken, refreshToken } = await genAccessAndRefreshTokens(
    existingReceptionist
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
      receptionist: {
        name: existingReceptionist.name,
        email: existingReceptionist.email,
      },
      accessToken,
      refreshToken,
      message: "Logged in successfully",
    });
};

const receptionistLogout = async (req, res) => {
  const receptionistId = req.receptionist._id;

  //   unset refreshToken
  await ReceptionistModel.findByIdAndUpdate(
    receptionistId,
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

const checkReceptionistRefreshToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken)
    throw new ResponseError(403, "Unauthorized request");

  jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decodedToken) => {
      if (err) {
        if (err.name === "JsonWebTokenError")
          throw new ResponseError(401, "Invalid access token");
        if (err.name === "TokenExpiredError")
          throw new ResponseError(401, "Access token expired");
      }
      ReceptionistModel.findById(decodedToken?._id).then((receptionist) => {
        if (!receptionist)
          throw new ResponseError(403, "Invalid Refresh Token");

        // if(incomingRefreshToken !== receptionist.refreshToken)
        //   throw new ResponseError("Refresh token is expired or used")

        return res.status(200).json({
          name: receptionist.name,
          email: receptionist.email,
          success: true,
          message: "Valid Receptionist",
        });
      });
    }
  );
};

export { receptionistLogin, receptionistLogout, checkReceptionistRefreshToken };
