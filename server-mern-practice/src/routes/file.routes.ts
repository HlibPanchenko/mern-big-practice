import express, { Router } from "express";
import { FileController } from "../controllers/FileController.js";
import { checkAuth } from "../utils/checkAuth.js";
import { UploadService } from "../services/multer.service.js";
// const fileRouter = express.Router();
// fileRouter.post("/uploadfile", checkAuth, fileController.uploadFile);
// export { fileRouter };
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../utils/types.js";

@injectable()
export class FileRouter {
  private router: Router;
  // private fileController: FileController;
  // private multerService: UploadService;

  constructor(
    @inject(TYPES.FileController) private fileController: FileController,
    @inject(TYPES.UploadService1) private multerService: UploadService
  ) {
    this.router = Router();
    // this.fileController = fileController;
    // this.multerService = multerService;

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
    this.router.post(
      "/recognition",
      checkAuth,
      // upload.single("avatar"),
      this.multerService.single("imageForAi"),
      this.fileController.recognizeFile
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
