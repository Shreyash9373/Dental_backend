import express from "express";
import saveEnquiry from "../controllers/patientController.js";

const patientRouter = express.Router();

patientRouter.post("/save-enquiry", saveEnquiry);
export default patientRouter;
