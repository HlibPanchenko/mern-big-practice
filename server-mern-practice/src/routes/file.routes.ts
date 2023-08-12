import express, { Router } from "express";
import { FileController } from "../controllers/FileController.js";
import { checkAuth } from "../utils/checkAuth.js";
import multer from "multer";
import path from "path";
import config from "config";
import fs from "fs";
import { IUserIdRequest } from "../utils/req.interface.js";

// const fileRouter = express.Router();
// fileRouter.post("/uploadfile", checkAuth, fileController.uploadFile);
// export { fileRouter };

export class FileRouter {
  private router: Router;
  private fileController: FileController;

  constructor(fileController: FileController) {
    this.router = Router();
    this.fileController = fileController;
    
    const storage = multer.diskStorage({
      destination: function (req: IUserIdRequest, file, cb) {
        const userId = req.userId as string;
        const userFolderPath = path.join(config.get("staticPath"), userId);
        // Создание папки пользователя, если она не существует
        if (!fs.existsSync(userFolderPath)) {
          fs.mkdirSync(userFolderPath);
        }
        // Указываем путь, куда сохранять файл
        cb(null, userFolderPath);
      },
      filename: function (req: IUserIdRequest, file, cb) {
        cb(
          null,
          file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
      },
    });

    const upload = multer({
      storage: storage,
      limits: { fileSize: 1024 * 1024 },
      fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/")) {
          cb(null, true);
        } else {
          cb(new Error("Only images are allowed."));
        }
      },
    });

    this.configureRoutes(upload);
  }

  private configureRoutes(upload: multer.Multer): void {
    this.router.post(
      "/uploadfile",
      checkAuth,
      upload.single("avatar"),
      this.fileController.uploadFile
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
