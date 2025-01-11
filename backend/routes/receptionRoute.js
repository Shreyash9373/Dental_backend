import express from "express";
import {
  bookAppointment,
  getPatient,
  getEnquiry,
  updatePatient,
  getAvailableSlots,
} from "../controllers/receptionController.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const receptionRouter = express.Router();

receptionRouter.post("/book-appointment", bookAppointment);
receptionRouter.post("/get-patient", getPatient);
receptionRouter.get("/get-Enquiry", getEnquiry);
receptionRouter.put("/update-patient", updatePatient);
receptionRouter.get("/available-slots" , getAvailableSlots);


export default receptionRouter;
