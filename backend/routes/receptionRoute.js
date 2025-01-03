import express from "express";
import bookAppointment from "../controllers/receptionController.js";
const receptionRouter = express.Router();

receptionRouter.post("/book-appointment", bookAppointment);

export default receptionRouter;
