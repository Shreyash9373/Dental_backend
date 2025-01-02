import express from "express";
import cors from "cors";
import connectMongo from "./db/connectMongo.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 4000;

connectMongo();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("api working perfectly");
});
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
