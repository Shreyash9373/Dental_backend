import express from "express";
import upload from "../config/multer.js";
import { addEvent, addBlogs } from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.post("/add-event", upload.single("image"), addEvent);
doctorRouter.post("/add-blog", upload.single("image"), addBlogs);

export default doctorRouter;
