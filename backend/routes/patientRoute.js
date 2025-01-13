import express from "express";
import {
  saveEnquiry,
  getEvent,
  getBlog,
} from "../controllers/patientController.js";

const patientRouter = express.Router();

patientRouter.post("/save-enquiry", saveEnquiry);
patientRouter.get("/get-event", getEvent);
patientRouter.get("/get-blog", getBlog);

export default patientRouter;
