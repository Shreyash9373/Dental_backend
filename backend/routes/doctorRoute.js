import express from "express";
import upload from "../config/multer.js";
import { addEvent, addBlogs } from "../controllers/doctorController.js";
import checkDoctor from "../middlewares/checkDoc.middleware.js";
import {
  addReceptionist,
  changeDoctorPassword,
  changeReceptionistPassword,
  checkDoctorRefreshToken,
  doctorLogin,
  doctorLogout,
  doctorRegister,
} from "../controllers/doctor.controller.js";
import { AsyncErrorHandler } from "../utils/AsyncErrorHandler.js";
import { verifyDoctor } from "../middlewares/auth.middleware.js";

const doctorRouter = express.Router();

// Prefix: /api/doctor
doctorRouter.post("/login", AsyncErrorHandler(doctorLogin));
doctorRouter.post("/register", AsyncErrorHandler(doctorRegister));
doctorRouter.get("/logout", verifyDoctor, AsyncErrorHandler(doctorLogout));
doctorRouter.get("/check-refresh", AsyncErrorHandler(checkDoctorRefreshToken));
doctorRouter.post(
  "/change-password",
  verifyDoctor,
  AsyncErrorHandler(changeDoctorPassword)
);
doctorRouter.post(
  "/add-receptionist",
  verifyDoctor,
  AsyncErrorHandler(addReceptionist)
);
doctorRouter.post(
  "/change-receptionist-password",
  verifyDoctor,
  AsyncErrorHandler(changeReceptionistPassword)
);

doctorRouter.post("/add-event", upload.single("image"), verifyDoctor, addEvent);
doctorRouter.post("/add-blog", upload.single("image"), verifyDoctor, addBlogs);

export default doctorRouter;
