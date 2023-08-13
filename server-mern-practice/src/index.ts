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
import { FileService } from "./services/File.service.js";
import { UploadService } from "./services/multer.service.js";
import { MulterConfigs } from "./utils/multerConfig.js";
import { UserService } from './services/User.service.js'
import { PostService } from './services/Post.service.js'

// oop
async function initApp() {
  const fileService = new FileService();
  const multerService = new UploadService(MulterConfigs.config1); // передайте объект конфигурации в конструктор
  const multerService2 = new UploadService(MulterConfigs.config2); 
  const userController = new UserController(new UserService());
  const fileController = new FileController(fileService);
  const postController = new PostController(new PostService());
  const authRouter = new AuthRouter(userController);
  const fileRouter = new FileRouter(fileController, multerService);
  const postRouter = new PostRouter(postController, multerService2);
  const app = new App(new MyLogger(), authRouter, fileRouter, postRouter);
  await app.start();
}

initApp();
