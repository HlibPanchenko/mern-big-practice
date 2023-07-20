// multerConfig.js

import multer from "multer";
import path from "path";
import config from "config";

// Создание хранилища для загруженных файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.userId;
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
const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed."));
  }
};

// Экспортируем объект конфигурации multer
export const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // Ограничение размера файла (в данном случае 1MB)
  fileFilter: fileFilter,
});
