import express from "express";
import { login , register , logoutUser , refreshAccessToken , changeCurrentPassword } from "../controllers/dashboardController.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { AsyncErrorHandler } from "../utils/AsyncErrorHandler.js";

const dashboardRouter = express.Router();

dashboardRouter.post("/login", AsyncErrorHandler(login)); // Corrected the router name
dashboardRouter.post("/register" , AsyncErrorHandler(register))
dashboardRouter.post("/logout" ,verifyJwt, logoutUser)
dashboardRouter.post("/refreshToken"  , refreshAccessToken)
dashboardRouter.post("/change-password" ,verifyJwt , changeCurrentPassword)
export default dashboardRouter;
