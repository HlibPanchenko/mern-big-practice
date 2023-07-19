import multer from "multer";
import path from "path";
import config from "config";
import fs from "fs";
import Post from "../models/Post.js";
import User from "../models/User.js";
// import { Response } from "express";

export const createPost = async (req, res) => {
  // Получим ID пользователя чтобы понять какой пользователь отправил запрос
  const userId = req.userId; // Получение ID пользователя
  console.log(req.body);
  const { text, description } = req.body;
  // Путь к папке пользователя
  const userFolderPath = path.join(config.get("staticPath"), userId);

  // Создание папки пользователя, если она не существует
  if (!fs.existsSync(userFolderPath)) {
    fs.mkdirSync(userFolderPath);
  }

  // юудем для каждого поста создавать отдельную папку в папке пользователя. Имя папки - название поста
  // const userSubFolderPath = path.join(userFolderPath, text);

  const user = await User.findById(req.userId);

  // Создаем запись о посте в базе данных
  const post = await Post.create({
    author: user,
    title: text,
    description,
    images: [], // Мы добавим пути к изображениям позже
  });

  // Создание хранилища для загруженных файлов
  const storage = multer.diskStorage({
    destination: userFolderPath, // Папка пользователя, в которую будут сохраняться файлы
    filename: function (req, file, cb) {
      // Генерация уникального имени файла
      // Функция cb используется для передачи сформированного имени файла обратно в Multer.
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  // Expalanation
  /*
  file.fieldname: Это имя поля формы, из которого загружается файл. В данном случае, это "avatar", так как в коде указано .single("avatar").
  Таким образом, после выполнения функции cb в методе filename, Multer получает сформированное имя файла и продолжает процесс сохранения файла на диск.
  */

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
  }).array("images", 10); // 'images' - это имя поля формы для изображений, 5 - максимальное количество изображений
  // single("avatar"): Это метод, указывающий Multer, что ожидается только один файл, и его поле формы имеет имя "avatar".
  // После инициализации Multer вызывается функция upload, передавая ей req, res и коллбэк-функцию:
  // В этой функции upload происходит загрузка файла на сервер. После загрузки файла и передачи коллбэка function (err), который будет вызван после загрузки, код проверяет наличие ошибок.

  try {
    await upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Ошибка Multer при загрузке файла
        return res.status(400).json({ error: err.message });
      } else if (err) {
        // Другая ошибка
        return res.status(500).json({ error: err.message });
      }

      // Вывод информации о загружаемом файле в консоль
      console.log("Uploaded file:", req.file);
      /*
  Uploaded file: {
  fieldname: 'avatar',
  originalname: 'h5mk7js_cat-generic_625x300_28_August_20.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'C:\\Users\\Глеб\\Desktop\\Frontend\\node js\\mern-practice (all)\\mern-practice\\server-mern-practice\\static\\64aeb29e911801442cacd33f',
  filename: 'avatar-1689173764423.jpg',
  path: 'C:\\Users\\Глеб\\Desktop\\Frontend\\node js\\mern-practice (all)\\mern-practice\\server-mern-practice\\static\\64aeb29e911801442cacd33f\\avatar-1689173764423.jpg',
  size: 42513
}
  */

      // Файл успешно загружен
      // Изображения успешно загружены
      const imagePaths = req.files.map((file) =>
        path.join(userSubFolderPath, file.filename)
      );

      // Обновление записи пользователя в базе данных с ссылкой на загруженный файл
      // Например, используя Mongoose:

      // Обновляем запись о посте с путями к изображениям
      // await Post.findByIdAndUpdate(
      //   post._id,
      //   { images: imagePaths },
      //   { new: true }
      // );

      // return res.json({
      //   message: "Пост успешно создан.",
      //   post: post,
      // });

      Post.findByIdAndUpdate(post._id, { images: imagePaths }, { new: true })
        .exec()
        .then((newPost) => {
          if (!newPost) {
            throw new Error("Post not found.");
          }
          return res.json({
            message: "Пост успешно создан.",
            post: newPost,
          });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ error: "Ошибка при обновлении записи о посте." });
        });
    });
  } catch (err) {
    return res.status(500).json({ error: "Не удалось создать пост." });
  }
};

// export const createPost = async (req, res) => {
//   // Получим ID пользователя чтобы понять какой пользователь отправил запрос
//   const userId = req.userId; // Получение ID пользователя
//   console.log(req.body);
//   const { title, description } = req.body;

//   try {
//     return res.json({
//       message: "Пост успешно создан.",
//       // post: newPost,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ error: "Ошибка при обновлении записи о посте." });
//   }
// };
