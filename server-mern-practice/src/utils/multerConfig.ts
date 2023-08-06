import multer from "multer";
import path from "path";
import config from "config";
import { Request, Response, NextFunction } from "express";
import { IUserIdRequest } from "../utils/req.interface.js";

// Создание хранилища для загруженных файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const typedReq = req as IUserIdRequest; // Cast req to your custom type
    // const userId = req.userId;
    const userId = typedReq.userId;
    if (!userId) {
      return cb(new Error("User ID not provided."), "");
    }
    const userFolderPath = path.join(config.get("staticPath"), userId);
    cb(null, userFolderPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Функция фильтрации файлов (позволяет принимать только изображения)
const fileFilter = function (req: Request, file: Express.Multer.File, cb: any) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed."));
  }
};

// Экспортируем объект конфигурации multer
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение размера файла (в данном случае 1MB)
  fileFilter: fileFilter,
});
