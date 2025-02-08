import express from "express";

import { AsyncErrorHandler } from "../utils/AsyncErrorHandler.js";
import {
  getPatient,
  addPatient,
  searchPatient,
  updatePatient,
} from "../controllers/patient.controller.js";
import { verifyReceptionist } from "../middlewares/auth.middleware.js";
const patientRoutes = express.Router();

// Prefix: /api/patients
patientRoutes.get(
  "/patient/:patientId",
  verifyReceptionist,
  AsyncErrorHandler(getPatient)
);
patientRoutes.post(
  "/add-patient",
  verifyReceptionist,
  AsyncErrorHandler(addPatient)
);
patientRoutes.get(
  "/search-patient",
  verifyReceptionist,
  AsyncErrorHandler(searchPatient)
);
patientRoutes.put(
  "/:patientId",
  verifyReceptionist,
  AsyncErrorHandler(updatePatient)
);

export default patientRoutes;
