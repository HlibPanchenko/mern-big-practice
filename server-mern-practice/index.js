import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "config";

import { authRouter } from "./routes/auth.routes.js";

const app = express();
const PORT = config.get("serverPORT");

app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);

const init = async () => {
  try {
    await mongoose.connect(config.get("dbUrl"));
    app.listen(PORT, () => {
      console.log("server started on port", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

init();
