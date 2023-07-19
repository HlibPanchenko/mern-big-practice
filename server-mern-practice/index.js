import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "config";

import { authRouter } from "./routes/auth.routes.js";
import { fileRouter } from "./routes/file.routes.js";
import { postRouter } from "./routes/post.routes.js";

const app = express();
const PORT = config.get("serverPORT");

app.use(express.json());
app.use(cors());
app.use(express.static("static"));

app.use("/auth", authRouter);
app.use("/file", fileRouter);
app.use("/post", postRouter);

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
