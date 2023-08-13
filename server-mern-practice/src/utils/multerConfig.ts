import multer from "multer";
import path from "path";
import config from "config";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import { IUserIdRequest } from "./req.interface.js";
// import { ICreatePostRequest } from "../controllers/PostController.js";

// Создание хранилища для загруженных файлов
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const typedReq = req as IUserIdRequest; // Cast req to your custom type
//     // const userId = req.userId;
//     const userId = typedReq.userId;
//     if (!userId) {
//       return cb(new Error("User ID not provided."), "");
//     }
//     const userFolderPath = path.join(config.get("staticPath"), userId);
//     cb(null, userFolderPath);
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// // Функция фильтрации файлов (позволяет принимать только изображения)
// const fileFilter = function (req: Request, file: Express.Multer.File, cb: any) {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed."));
//   }
// };

// // Экспортируем объект конфигурации multer
// export const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение размера файла (в данном случае 1MB)
//   fileFilter: fileFilter,
// });

export class MulterConfigs {
  static config1 = {
    destination: function (
      req: IUserIdRequest,
      file: Express.Multer.File,
      cb: Function
    ) {
      const userId = req.userId as string;
      const userFolderPath = path.join(config.get("staticPath"), userId);
      // Создание папки пользователя, если она не существует
      if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath);
      }
      // Указываем путь, куда сохранять файл
      cb(null, userFolderPath);
    },
    filename: function (
      req: IUserIdRequest,
      file: Express.Multer.File,
      cb: Function
    ) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
    fileFilter: function (
      req: IUserIdRequest,
      file: Express.Multer.File,
      cb: Function
    ) {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only images are allowed."));
      }
    },
  };

  static config2 = {
    destination: function (
      req: IUserIdRequest,
      // req: IUserIdRequest,
      file: Express.Multer.File,
      cb: Function
    ) {
      const typedReq = req as IUserIdRequest; // Cast req to your custom type
      // const userId = req.userId;
      const userId = typedReq.userId;
      if (!userId) {
        return cb(new Error("User ID not provided."), "");
      }
      const userFolderPath = path.join(config.get("staticPath"), userId);
       // Создание папки пользователя, если она не существует
       if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath);
      }
      // теперь для каждого поста создаю свою подпапку
      const userSubFolderPath = path.join(userFolderPath, req.body.text);

      if (!fs.existsSync(userSubFolderPath)) {
        fs.mkdirSync(userSubFolderPath);
      }

      cb(null, userSubFolderPath);
      // cb(null, userFolderPath);
    },
    filename: function (
      req: IUserIdRequest,
      file: Express.Multer.File,
      cb: Function
    ) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
    fileFilter: function (req: Request, file: Express.Multer.File, cb: any) {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only images are allowed."));
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  };
}
