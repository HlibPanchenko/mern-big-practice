import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "config";
import bodyParser from "body-parser";

import { AuthRouter } from "./routes/auth.routes.js";
import { FileRouter } from "./routes/file.routes.js";
import { PostRouter } from "./routes/post.routes.js";

import { MyLogger } from "./logger/logger.service.js";

export class App {
  private app: Application;
  port: number;
  logger: MyLogger;
  authRouter: AuthRouter;
  fileRouter: FileRouter;
  postRouter: PostRouter;

  constructor(
    logger: MyLogger,
    authRouter: AuthRouter,
    fileRouter: FileRouter,
    postRouter: PostRouter
  ) {
    this.logger = logger;
    this.authRouter = authRouter;
    this.fileRouter = fileRouter;
    this.postRouter = postRouter;
    this.app = express();
    this.port = config.get("serverPORT");
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(express.static(config.get("staticPath")));
  }

  private configureRoutes(): void {
    this.app.use("/auth", this.authRouter.getRouter());
    this.app.use("/file", this.fileRouter.getRouter());
    this.app.use("/post", this.postRouter.getRouter());
  }

  public async start(): Promise<void> {
    try {
      await mongoose.connect(config.get("dbUrl"));
      this.app.listen(this.port, () => {
        this.logger.log(`Server started on port ${this.port}`);
        // console.log("Server started on port", this.port);
      });
    } catch (error) {
      // console.log(error);
      this.logger.logError(error);
    }
  }
}

// const appInstance = new App();
// appInstance.start();
