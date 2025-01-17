import express from "express";
import {
  login,
  register,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  addMember,
} from "../controllers/dashboardController.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { AsyncErrorHandler } from "../utils/AsyncErrorHandler.js";
import checkDoctor from "../middlewares/checkDoc.middleware.js";

const dashboardRouter = express.Router();

dashboardRouter.post("/login", AsyncErrorHandler(login)); // Corrected the router name
dashboardRouter.post("/register", AsyncErrorHandler(register));
dashboardRouter.post("/logout", verifyJwt, logoutUser);
dashboardRouter.post("/refreshToken", refreshAccessToken);
dashboardRouter.post("/addMember", AsyncErrorHandler(addMember));
dashboardRouter.post(
  "/change-password",
  verifyJwt,
  checkDoctor,
  changeCurrentPassword
);
export default dashboardRouter;
