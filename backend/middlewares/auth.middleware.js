import jwt from "jsonwebtoken";

import dashboardLogin from "../models/dashboardloginSchema.js";
import DoctorModel from "../models/doctor.model.js";
import { ResponseError } from "../utils/error.js";

const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user and exclude sensitive fields
    const user = await dashboardLogin
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    console.log(decodedToken);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid access token" });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid access token" });
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Access token expired" });
    }

    // For other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const verifyDoctor = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      if (err.name === "JsonWebTokenError")
        throw new ResponseError(401, "Invalid access token");
      if (err.name === "TokenExpiredError")
        throw new ResponseError(401, "Access token expired");
    }
    // Find the doctor and exclude sensitive fields
    DoctorModel.findById(decodedToken?._id)
      .select("-password -refreshToken")
      .then((doctor) => {
        if (!doctor) throw new ResponseError(401, "Invalid access token");

        // Attach the doctor to the request object
        req.doctor = doctor;
        next();
      });
  });
};

const checkDoctorRefreshToken = async (req, res) => {
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
      DoctorModel.findById(decodedToken?._id).then((doctor) => {
        if (!doctor) throw new ResponseError(403, "Invalid Refresh Token");

        // if(incomingRefreshToken !== doctor.refreshToken)
        //   throw new ResponseError("Refresh token is expired or used")

        return res.status(201).json({
          name: doctor.name,
          email: doctor.email,
          success: true,
          message: "Valid Doctor",
        });
      });
    }
  );
};

export { verifyJwt, verifyDoctor, checkDoctorRefreshToken };
