import express from "express";
import cors from "cors";
import connectMongo from "./db/connectMongo.js";
import "dotenv/config";
import receptionRouter from "./routes/receptionRoute.js";
import patientRouter from "./routes/patientRoute.js";
import cookieParser from "cookie-parser";
import dashboardRouter from "./routes/dashboardRoute.js";

import doctorRouter from "./routes/doctorRoute.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
const port = process.env.PORT || 4000;

connectMongo();
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // for reading and writing cookies in user's browser

app.get("/", (req, res) => {
  res.send("api working perfectly");
});

//api endpoints
app.use("/api/reception", receptionRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/patient", patientRouter);
app.use("/api/dashboard", dashboardRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
