import { Request, Response, NextFunction } from "express";
import { IUserIdRequest } from "../utils/req.interface.js";
import { FileService } from "../services/File.service.js";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../utils/types.js";

// functional
// export const uploadFile = async (req: IUserIdRequest, res: Response) => {
//   if (!req.userId) {
//     return res.status(400).json({ error: "User ID not provided." });
//   }

//   const userId = req.userId; // Получение ID пользователя

//   // Путь к папке пользователя
//   const userFolderPath = path.join(config.get("staticPath"), userId);

//   // Создание папки пользователя, если она не существует
//   if (!fs.existsSync(userFolderPath)) {
//     fs.mkdirSync(userFolderPath);
//   }

//   // Создание хранилища для загруженных файлов
//   const storage = multer.diskStorage({
//     destination: userFolderPath, // Папка пользователя, в которую будут сохраняться файлы
//     filename: function (req, file, cb) {
//       // Генерация уникального имени файла
//       // Функция cb используется для передачи сформированного имени файла обратно в Multer.
//       cb(
//         null,
//         file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//       );
//     },
//   });

//   // Expalanation
//   /*
//   file.fieldname: Это имя поля формы, из которого загружается файл. В данном случае, это "avatar", так как в коде указано .single("avatar").
//   Таким образом, после выполнения функции cb в методе filename, Multer получает сформированное имя файла и продолжает процесс сохранения файла на диск.
//   */

//   // Инициализация multer с использованием созданного хранилища
//   const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 }, // Ограничение размера файла (в данном случае 1MB)
//     fileFilter: function (req, file, cb) {
//       // Проверка типа файла (допустимы только изображения)
//       if (file.mimetype.startsWith("image/")) {
//         cb(null, true);
//       } else {
//         cb(new Error("Only images are allowed."));
//       }
//     },
//   }).single("avatar"); // Имя поля формы для загрузки фотографии
//   // single("avatar"): Это метод, указывающий Multer, что ожидается только один файл, и его поле формы имеет имя "avatar".
//   // После инициализации Multer вызывается функция upload, передавая ей req, res и коллбэк-функцию:
//   // В этой функции upload происходит загрузка файла на сервер. После загрузки файла и передачи коллбэка function (err), который будет вызван после загрузки, код проверяет наличие ошибок.
//   try {
//     await upload(req, res, function (err) {
//       if (err instanceof multer.MulterError) {
//         // Ошибка Multer при загрузке файла
//         return res.status(400).json({ error: err.message });
//       } else if (err) {
//         // Другая ошибка
//         return res.status(500).json({ error: err.message });
//       }

//       // Вывод информации о загружаемом файле в консоль
//       console.log("Uploaded file:", req.file);
//       /*
//   Uploaded file: {
//   fieldname: 'avatar',
//   originalname: 'h5mk7js_cat-generic_625x300_28_August_20.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'C:\\Users\\Глеб\\Desktop\\Frontend\\node js\\mern-practice (all)\\mern-practice\\server-mern-practice\\static\\64aeb29e911801442cacd33f',
//   filename: 'avatar-1689173764423.jpg',
//   path: 'C:\\Users\\Глеб\\Desktop\\Frontend\\node js\\mern-practice (all)\\mern-practice\\server-mern-practice\\static\\64aeb29e911801442cacd33f\\avatar-1689173764423.jpg',
//   size: 42513
// }
//   */

//       // Файл успешно загружен
//       // Обновление записи пользователя в базе данных с ссылкой на загруженный файл
//       // Например, используя Mongoose:
//       User.findByIdAndUpdate(
//         req.userId, // ID пользователя, чья фотография загружается
//         { avatar: req?.file?.filename }, // Обновление поля "avatar" на имя загруженного файла
//         { new: true } // фото будет сразу же заменяться на новое
//       )
//         .exec()
//         /* exec() не является методом Mongoose модели User, а является методом Mongoose Query. В представленном коде он используется после вызова User.findByIdAndUpdate().
//            Метод exec() выполняет запрос Mongoose и возвращает Promise, который разрешается результатом запроса.
//            Он выполняет операцию поиска/изменения/удаления в базе данных, связанной с определенной моделью.
//           В контексте кода выше, User.findByIdAndUpdate() возвращает Mongoose Query, который представляет операцию поиска и обновления документа
//           пользователя по заданному идентификатору. Вызов exec() в данном случае запускает этот запрос и возвращает Promise, который разрешается
//           обновленным документом пользователя. Затем, с помощью метода .then(), результат запроса передается в следующий блок кода для формирования ответа сервера.*/
//         .then((updatedUser) => {
//           if (!updatedUser) {
//             throw new Error("User not found.");
//           }
//           return res.json({
//             message: "Photo uploaded successfully.",
//             user: updatedUser,
//           });
//         })
//         .catch((err) => {
//           return res
//             .status(500)
//             .json({ error: "Failed to update user photo." });
//         });
//     });
//   } catch (err) {
//     return res.status(500).json({ error: "Failed to update user photo." });
//   }
// };

// ООП

// OOP
@injectable()
export class FileController {
  // fileService: FileService;

  constructor(@inject(TYPES.FileService) private fileService: FileService) {
    // this.fileService = fileService;
    this.uploadFile = this.uploadFile.bind(this); // привязка к контексту
  }
  async uploadFile(req: IUserIdRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(400).json({ error: "User ID not provided." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "image not provided." });
      }

      console.log("Before calling fileService:", req.file);
      // service will do all the bussiness logic
      const updatedUser = await this.fileService.uploadUserAvatar(req);
      // all moved to fileService
      // Путь к папке пользователя
      //   const userFolderPath = path.join(config.get("staticPath"), userId);

      //   // Создание папки пользователя, если она не существует
      //   if (!fs.existsSync(userFolderPath)) {
      //     fs.mkdirSync(userFolderPath);
      //   }

      //   // Создание хранилища для загруженных файлов
      //   const storage = multer.diskStorage({
      //     destination: userFolderPath, // Папка пользователя, в которую будут сохраняться файлы
      //     filename: function (req, file, cb) {
      //       // Генерация уникального имени файла
      //       // Функция cb используется для передачи сформированного имени файла обратно в Multer.
      //       cb(
      //         null,
      //         file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      //       );
      //     },
      //   });

      //   // Expalanation
      //   /*
      //   file.fieldname: Это имя поля формы, из которого загружается файл. В данном случае, это "avatar", так как в коде указано .single("avatar").
      //   Таким образом, после выполнения функции cb в методе filename, Multer получает сформированное имя файла и продолжает процесс сохранения файла на диск.
      //   */

      //   // Инициализация multer с использованием созданного хранилища
      //   const upload = multer({
      //     storage: storage,
      //     limits: { fileSize: 1024 * 1024 }, // Ограничение размера файла (в данном случае 1MB)
      //     fileFilter: function (req, file, cb) {
      //       // Проверка типа файла (допустимы только изображения)
      //       if (file.mimetype.startsWith("image/")) {
      //         cb(null, true);
      //       } else {
      //         cb(new Error("Only images are allowed."));
      //       }
      //     },
      //   }).single("avatar"); // Имя поля формы для загрузки фотографии
      //   // single("avatar"): Это метод, указывающий Multer, что ожидается только один файл, и его поле формы имеет имя "avatar".
      //   // После инициализации Multer вызывается функция upload, передавая ей req, res и коллбэк-функцию:
      //   // В этой функции upload происходит загрузка файла на сервер. После загрузки файла и передачи коллбэка function (err), который будет вызван после загрузки, код проверяет наличие ошибок.
      //   try {
      //     await upload(req, res, function (err) {
      //       if (err instanceof multer.MulterError) {
      //         // Ошибка Multer при загрузке файла
      //         return res.status(400).json({ error: err.message });
      //       } else if (err) {
      //         // Другая ошибка
      //         return res.status(500).json({ error: err.message });
      //       }

      //       // Вывод информации о загружаемом файле в консоль
      //       // console.log("Uploaded file:", req.file);
      //       /*
      //   Uploaded file: {
      //   fieldname: 'avatar',
      //   originalname: 'h5mk7js_cat-generic_625x300_28_August_20.jpg',
      //   encoding: '7bit',
      //   mimetype: 'image/jpeg',
      //   destination: 'C:\\Users\\Глеб\\Desktop\\Frontend\\node js\\mern-practice (all)\\mern-practice\\server-mern-practice\\static\\64aeb29e911801442cacd33f',
      //   filename: 'avatar-1689173764423.jpg',
      //   path: 'C:\\Users\\Глеб\\Desktop\\Frontend\\node js\\mern-practice (all)\\mern-practice\\server-mern-practice\\static\\64aeb29e911801442cacd33f\\avatar-1689173764423.jpg',
      //   size: 42513
      // }
      //   */

      //       // Файл успешно загружен
      //       // Обновление записи пользователя в базе данных с ссылкой на загруженный файл
      //       // Например, используя Mongoose:
      //       User.findByIdAndUpdate(
      //         req.userId, // ID пользователя, чья фотография загружается
      //         { avatar: req?.file?.filename }, // Обновление поля "avatar" на имя загруженного файла
      //         { new: true } // фото будет сразу же заменяться на новое
      //       )
      //         .exec()
      //         .then((updatedUser) => {
      //           if (!updatedUser) {
      //             throw new Error("User not found.");
      //           }
      //           return res.json({
      //             message: "Photo uploaded successfully.",
      //             user: updatedUser,
      //           });
      //         })
      //         .catch((err) => {
      //           return res
      //             .status(500)
      //             .json({ error: "Failed to update user photo." });
      //         });
      //     });

      //   }
      return res.json({
        message: "Photo uploaded successfully.",
        user: updatedUser,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update user photo." });
    }
  }
}
