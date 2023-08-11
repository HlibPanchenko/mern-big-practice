import express, { Router } from "express";
import {FileController} from "../controllers/FileController.js";
import { checkAuth } from "../utils/checkAuth.js";

// const fileRouter = express.Router();
// fileRouter.post("/uploadfile", checkAuth, fileController.uploadFile);
// export { fileRouter };

export class FileRouter {
  private router: Router;
  private fileController: FileController;

  constructor(fileController: FileController) {
    this.router = Router();
    this.fileController = fileController;
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post("/uploadfile", checkAuth, this.fileController.uploadFile);
  }

  public getRouter(): Router {
    return this.router;
  }
}
