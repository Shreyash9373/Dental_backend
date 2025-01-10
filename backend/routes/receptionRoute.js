import express from "express";
import {
  bookAppointment,
  getPatient,
  getEnquiry,
  updatePatient,
} from "../controllers/receptionController.js";
const receptionRouter = express.Router();

receptionRouter.post("/book-appointment", bookAppointment);
receptionRouter.post("/get-patient", getPatient);
receptionRouter.get("/get-Enquiry", getEnquiry);
receptionRouter.post("/update-patient", updatePatient);

export default receptionRouter;
