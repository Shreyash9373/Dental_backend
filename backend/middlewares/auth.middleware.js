import jwt from "jsonwebtoken";

import dashboardLogin from "../models/dashboardloginSchema.js";
import DoctorModel from "../models/doctor.model.js";
import { ResponseError } from "../utils/error.js";
import ReceptionistModel from "../models/receptionist.model.js";

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

const verifyReceptionist = async (req, res, next) => {
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
    ReceptionistModel.findById(decodedToken?._id)
      .select("-password -refreshToken")
      .then((receptionist) => {
        if (!receptionist) throw new ResponseError(401, "Invalid access token");

        // Attach the receptionist to the request object
        req.receptionist = receptionist;
        next();
      });
  });
};

export { verifyJwt, verifyDoctor, verifyReceptionist };
