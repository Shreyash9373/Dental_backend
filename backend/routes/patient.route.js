import express from "express";

import { AsyncErrorHandler } from "../utils/AsyncErrorHandler.js";
import {
  addPatient,
  searchPatient,
  getPatient,
} from "../controllers/patient.controller.js";
import { verifyReceptionist } from "../middlewares/auth.middleware.js";
const patientRoutes = express.Router();

// Prefix: /api/patient
patientRoutes.post(
  "/add-patient",
  verifyReceptionist,
  AsyncErrorHandler(addPatient)
);
patientRoutes.get(
  "/patient/:prn",
  verifyReceptionist,
  AsyncErrorHandler(getPatient)
);
patientRoutes.get(
  "/search-patient",
  verifyReceptionist,
  AsyncErrorHandler(searchPatient)
);

export default patientRoutes;
