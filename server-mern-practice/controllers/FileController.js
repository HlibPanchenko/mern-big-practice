import multer from "multer";
import path from "path";
import config from "config";
import fs from "fs";
import User from "../models/User.js";

export const uploadFile = async (req, res) => {
  const userId = req.userId; // Получение ID пользователя

  // Путь к папке пользователя
  const userFolderPath = path.join(config.get("staticPath"), userId);

  // Создание папки пользователя, если она не существует
  if (!fs.existsSync(userFolderPath)) {
    fs.mkdirSync(userFolderPath);
  }

  // Создание хранилища для загруженных файлов
  const storage = multer.diskStorage({
    destination: userFolderPath, // Папка пользователя, в которую будут сохраняться файлы
    filename: function (req, file, cb) {
      // Генерация уникального имени файла
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  // Инициализация multer с использованием созданного хранилища
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 }, // Ограничение размера файла (в данном случае 1MB)
    fileFilter: function (req, file, cb) {
      // Проверка типа файла (допустимы только изображения)
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only images are allowed."));
      }
    },
  }).single("avatar"); // Имя поля формы для загрузки фотографии

  try {
    await upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Ошибка Multer при загрузке файла
        return res.status(400).json({ error: err.message });
      } else if (err) {
        // Другая ошибка
        return res.status(500).json({ error: err.message });
      }

      // Файл успешно загружен
      // Обновление записи пользователя в базе данных с ссылкой на загруженный файл
      // Например, используя Mongoose:
      User.findByIdAndUpdate(
        req.userId, // ID пользователя, чья фотография загружается
        { avatar: req.file.filename }, // Обновление поля "avatar" на имя загруженного файла
        { new: true } // фото будет сразу же заменяться на новое
      )
        .exec()
        .then((updatedUser) => {
          if (!updatedUser) {
            throw new Error("User not found.");
          }
          return res.json({
            message: "Photo uploaded successfully.",
            user: updatedUser,
          });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ error: "Failed to update user photo." });
        });
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update user photo." });
  }
};

// // Создание хранилища для загруженных файлов
// const storage = multer.diskStorage({
//   destination: config.get("staticPath"), // Папка, в которую будут сохраняться файлы
//   filename: function (req, file, cb) {
//     // Генерация уникального имени файла
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// // Инициализация multer с использованием созданного хранилища
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 }, // Ограничение размера файла (в данном случае 1MB)
//   fileFilter: function (req, file, cb) {
//     // Проверка типа файла (допустимы только изображения)
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only images are allowed."));
//     }
//   },
// }).single("avatar"); // Имя поля формы для загрузки фотографии

// export const uploadFile = async (req, res) => {
//   try {
//     await upload(req, res, function (err) {
//       if (err instanceof multer.MulterError) {
//         // Ошибка Multer при загрузке файла
//         return res.status(400).json({ error: err.message });
//       } else if (err) {
//         // Другая ошибка
//         return res.status(500).json({ error: err.message });
//       }

//       // Файл успешно загружен
//       // Обновление записи пользователя в базе данных с ссылкой на загруженный файл
//       // Например, используя Mongoose:
//       User.findByIdAndUpdate(
//         req.userId, // ID пользователя, чья фотография загружается
//         { avatar: req.file.filename }, // Обновление поля "avatar" на имя загруженного файла
//         // фотка сразу меняется когда мы добавляем другое фото
//         { new: true }
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
//   } catch (err) {
//     return res.status(500).json({ error: "Failed to update user photo." });
//   }
// };
