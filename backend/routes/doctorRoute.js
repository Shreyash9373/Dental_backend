import express from "express";
import upload from "../config/multer.js";
import { addEvent, addBlogs } from "../controllers/doctorController.js";
import checkDoctor from "../middlewares/checkDoc.middleware.js";

const doctorRouter = express.Router();

doctorRouter.post("/add-event", upload.single("image"),checkDoctor , addEvent);
doctorRouter.post("/add-blog", upload.single("image"),checkDoctor, addBlogs);

export default doctorRouter;
