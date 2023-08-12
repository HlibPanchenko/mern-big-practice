import express, { Router } from "express";
import { FileController } from "../controllers/FileController.js";
import { checkAuth } from "../utils/checkAuth.js";
import multer from "multer";
import path from "path";
import config from "config";
import fs from "fs";
import { IUserIdRequest } from "../utils/req.interface.js";
import { UploadService } from "../services/multer.service.js";
// const fileRouter = express.Router();
// fileRouter.post("/uploadfile", checkAuth, fileController.uploadFile);
// export { fileRouter };

export class FileRouter {
  private router: Router;
  private fileController: FileController;
  private multerService: UploadService;

  constructor(fileController: FileController, multerService: UploadService) {
    this.router = Router();
    this.fileController = fileController;
    this.multerService = multerService;

    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post(
      "/uploadfile",
      checkAuth,
      // upload.single("avatar"),
      this.multerService.single("avatar"),
      this.fileController.uploadFile
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
