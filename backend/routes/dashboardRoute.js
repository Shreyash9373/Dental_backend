import express from "express";
import { login , register , logoutUser , refreshAccessToken , changeCurrentPassword } from "../controllers/dashboardController.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const dashboardRouter = express.Router();

dashboardRouter.post("/login", login); // Corrected the router name
dashboardRouter.post("/register" , register)
dashboardRouter.post("/logout" ,verifyJwt, logoutUser)
dashboardRouter.post("/refreshToken"  , refreshAccessToken)
dashboardRouter.post("/change-password" ,verifyJwt , changeCurrentPassword)
export default dashboardRouter;
