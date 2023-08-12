import multer from "multer";
import fs from "fs";
import path from "path";
import User from "../models/User.js";
import config from "config";
import { IUserIdRequest } from "../utils/req.interface.js";

// export class FileService {
//   async uploadUserAvatar(userId:string, file:Express.Multer.File) {
//     const userFolderPath = path.join(config.get("staticPath"), userId);

//     if (!fs.existsSync(userFolderPath)) {
//       fs.mkdirSync(userFolderPath);
//     }

//     const storage = multer.diskStorage({
//       destination: userFolderPath,
//       filename: function (req, file, cb) {
//         cb(
//           null,
//           file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//         );
//       },
//     });

//     const upload = multer({
//       storage: storage,
//       limits: { fileSize: 1024 * 1024 },
//       fileFilter: function (req, file, cb) {
//         if (file.mimetype.startsWith("image/")) {
//           cb(null, true);
//         } else {
//           cb(new Error("Only images are allowed."));
//         }
//       },
//     }).single("avatar");

//     return new Promise((resolve, reject) => {
//       upload(req, null, function (err) {
//         if (err instanceof multer.MulterError) {
//           reject(err);
//         } else if (err) {
//           reject(err);
//         }

//         User.findByIdAndUpdate(
//           userId,
//           { avatar: req?.file?.filename },
//           { new: true }
//         )
//           .exec()
//           .then((updatedUser) => {
//             if (!updatedUser) {
//               throw new Error("User not found.");
//             }
//             resolve(updatedUser);
//           })
//           .catch((err) => {
//             reject(err);
//           });
//       });
//     });
//   }
// }

// export class FileService {
//   upload: multer.Multer;

//   constructor() {
//     const storage = multer.diskStorage({
//       filename: function (req:IUserIdRequest, file, cb) {
//         const userId = req.userId as string; // Получение ID пользователя
//         const userFolderPath = path.join(config.get("staticPath"), userId);

//         cb(
//           null,
//           file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//         );
//       },
//     });

//     this.upload = multer({
//       storage: storage,
//       limits: { fileSize: 1024 * 1024 },
//       fileFilter: function (req, file, cb) {
//         if (file.mimetype.startsWith("image/")) {
//           cb(null, true);
//         } else {
//           cb(new Error("Only images are allowed."));
//         }
//       },
//     });
//   }

//   async uploadUserAvatar(req: IUserIdRequest): Promise<any> {
//     const userId = req.userId as string;
//     const userFolderPath = path.join(config.get("staticPath"), userId);

//     if (!fs.existsSync(userFolderPath)) {
//       fs.mkdirSync(userFolderPath);
//     }

//     return new Promise((resolve, reject) => {
//       this.upload.single("avatar")(req, null as any, function (err) {
//         if (err instanceof multer.MulterError) {
//           reject(err);
//         } else if (err) {
//           reject(err);
//         }

//         User.findByIdAndUpdate(
//           userId,
//           { avatar: req?.file?.filename },
//           { new: true }
//         )
//           .exec()
//           .then((updatedUser) => {
//             if (!updatedUser) {
//               throw new Error("User not found.");
//             }
//             resolve(updatedUser);
//           })
//           .catch((err) => {
//             reject(err);
//           });
//       });
//     });
//   }
// }

export class FileService {
  async uploadUserAvatar(req: IUserIdRequest): Promise<any> {
    console.log("Inside fileService:", req.file?.filename);
    const userId = req.userId as string;
    // Предполагаем, что multer уже обработал файл, поэтому нам просто нужно обновить пользователя
    return User.findByIdAndUpdate(
      userId,
      { avatar: req.file?.filename },
      { new: true }
    )
      .exec()
      .then((updatedUser) => {
        if (!updatedUser) {
          throw new Error("User not found.");
        }
        return updatedUser;
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }
}
