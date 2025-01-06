import express from "express";
import {
  bookAppointment,
  getPatient,
} from "../controllers/receptionController.js";
const receptionRouter = express.Router();

receptionRouter.post("/book-appointment", bookAppointment);
receptionRouter.post("/get-patient", getPatient);

export default receptionRouter;
