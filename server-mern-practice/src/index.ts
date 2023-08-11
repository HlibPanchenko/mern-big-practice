// functional
// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import config from "config";
// import bodyParser from "body-parser";

// import { authRouter } from "./routes/auth.routes.js";
// import { fileRouter } from "./routes/file.routes.js";
// import { postRouter } from "./routes/post.routes.js";

// const app: express.Application = express();
// const PORT: number = config.get("serverPORT");

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // app.use(express.json());
// app.use(cors());
// // app.use(express.static("static"));
// app.use(express.static(config.get("staticPath")));

// app.use("/auth", authRouter);
// app.use("/file", fileRouter);
// app.use("/post", postRouter);

// const init = async (): Promise<void> => {
//   try {
//     await mongoose.connect(config.get("dbUrl"));
//     app.listen(PORT, () => {
//       console.log("server started on port", PORT);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// init();
//
import { App } from "./app.js";
import { FileController } from "./controllers/FileController.js";
import { PostController } from "./controllers/PostController.js";
import { UserController } from "./controllers/UserController.js";
import { MyLogger } from "./logger/logger.service.js";
import { AuthRouter } from "./routes/auth.routes.js";
import { FileRouter } from "./routes/file.routes.js";
import { PostRouter } from "./routes/post.routes.js";

// oop
async function initApp() {
  const userController = new UserController();
  const fileController = new FileController();
  const postController = new PostController();
  const authRouter = new AuthRouter(userController);
  const fileRouter = new FileRouter(fileController);
  const postRouter = new PostRouter(postController);
  const app = new App(new MyLogger(), authRouter, fileRouter, postRouter);
  await app.start();
}

initApp();
