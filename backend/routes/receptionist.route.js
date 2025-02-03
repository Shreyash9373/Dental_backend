import express from "express";
import {
  bookAppointment,
  getPatient,
  getEnquiry,
  updatePatient,
  getAvailableSlots,
} from "../controllers/receptionController.js";
import {
  verifyJwt,
  verifyReceptionist,
} from "../middlewares/auth.middleware.js";
import checkReception from "../middlewares/checkRecep.middleware.js";
import {
  checkReceptionistRefreshToken,
  receptionistLogin,
  receptionistLogout,
} from "../controllers/receptionist.controller.js";
import { AsyncErrorHandler } from "../utils/AsyncErrorHandler.js";
const receptionistRoutes = express.Router();

// Prefix: /api/receptionists
receptionistRoutes.post("/login", AsyncErrorHandler(receptionistLogin));
receptionistRoutes.get(
  "/logout",
  AsyncErrorHandler(verifyReceptionist),
  AsyncErrorHandler(receptionistLogout)
);
receptionistRoutes.get(
  "/check-refresh",
  AsyncErrorHandler(checkReceptionistRefreshToken)
);

receptionistRoutes.post("/book-appointment", checkReception, bookAppointment);
receptionistRoutes.post(
  "/get-patient",
  AsyncErrorHandler(verifyJwt),
  getPatient
);
receptionistRoutes.get("/get-Enquiry", checkReception, getEnquiry);
receptionistRoutes.put("/update-patient", checkReception, updatePatient);
receptionistRoutes.get("/available-slots", getAvailableSlots);

export default receptionistRoutes;
