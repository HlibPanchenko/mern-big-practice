import multer from "multer";
import path from "path";
import config from "config";
import fs from "fs";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import SubComment from "../models/SubComment.js";
// import { Response } from "express";

export const createPost = async (req, res) => {
  // Получим ID пользователя чтобы понять какой пользователь отправил запрос
  const userId = req.userId; // Получение ID пользователя
  console.log(userId);
  const { text, description } = req.body;
  console.log(text, description);

  // Путь к папке пользователя
  const userFolderPath = path.join(config.get("staticPath"), userId);

  // Создание папки пользователя, если она не существует
  if (!fs.existsSync(userFolderPath)) {
    fs.mkdirSync(userFolderPath);
  }

  // юудем для каждого поста создавать отдельную папку в папке пользователя. Имя папки - название поста
  const userSubFolderPath = path.join(userFolderPath, text);

  const user = await User.findById(req.userId);

  // Создаем запись о посте в базе данных
  const post = await Post.create({
    author: user,
    title: text,
    description,
    images: [], // Мы добавим пути к изображениям позже
  });

  // Создание хранилища для загруженных файлов
  // const storage = multer.diskStorage({
  //   destination: userFolderPath, // Папка пользователя, в которую будут сохраняться файлы
  //   filename: function (req, file, cb) {
  //     // Генерация уникального имени файла
  //     // Функция cb используется для передачи сформированного имени файла обратно в Multer.
  //     cb(
  //       null,
  //       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
  //     );
  //   },
  // });

  // Expalanation
  /*
  file.fieldname: Это имя поля формы, из которого загружается файл. В данном случае, это "avatar", так как в коде указано .single("avatar").
  Таким образом, после выполнения функции cb в методе filename, Multer получает сформированное имя файла и продолжает процесс сохранения файла на диск.
  */

  // Инициализация multer с использованием созданного хранилища
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
  // }).array("images[]", 10); // 'images' - это имя поля формы для изображений, 5 - максимальное количество изображений
  // single("avatar"): Это метод, указывающий Multer, что ожидается только один файл, и его поле формы имеет имя "avatar".
  // После инициализации Multer вызывается функция upload, передавая ей req, res и коллбэк-функцию:
  // В этой функции upload происходит загрузка файла на сервер. После загрузки файла и передачи коллбэка function (err), который будет вызван после загрузки, код проверяет наличие ошибок.

  try {
    // await upload(req, res, function (err) {
    //   if (err instanceof multer.MulterError) {
    //     // Ошибка Multer при загрузке файла
    //     return res.status(400).json({ error: err.message });
    //   } else if (err) {
    //     // Другая ошибка
    //     return res.status(500).json({ error: err.message });
    //   }

    //   // Вывод информации о загружаемом файле в консоль
    //   console.log("Uploaded file:", req.file);
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
    // });
  } catch (err) {
    return res.status(500).json({ error: "Не удалось создать пост." });
  }
};

// export const createPost = async (req, res) => {
//   // Получим ID пользователя чтобы понять какой пользователь отправил запрос
//   const userId = req.userId; // Получение ID пользователя
//   const { text, description } = req.body;
//   console.log(text, description);
//   // console.log(req);

//   try {
//     return res.json({
//       message: "Пост успешно создан.",
//       description,
//       text,
//       // post: newPost,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ error: "Ошибка при обновлении записи о посте." });
//   }
// };

export const getallauthorposts = async (req, res) => {
  const userId = req.userId; // Получение ID пользователя
  try {
    const posts = await Post.find({ author: userId }).populate("author");
    return res.json({
      message: "Посты успешно найдены.",
      posts: posts, // Возвращаем найденные посты в ответе
    });
  } catch (err) {
    return res.status(500).json({ error: "Не удалось найти посты." });
  }
};

export const getonepost = async (req, res) => {
  const userId = req.userId; // Получение ID пользователя
  const postId = req.params.id;
  try {
    // const post = await Post.findById(postId).populate("author"); // Чтобы модель поста содержала в себе модель автора
    // Найдем пост по его ID и увеличим количество просмотров на 1
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } }, // $inc - оператор для увеличения значения на заданное число (в данном случае +1)
      { new: true } // Опция new: true возвращает обновленный пост после обновления
    )
      .populate({
        path: "author",
      })
      .populate({
        path: "comments",
        populate: [
          { path: "author" },
          {
            path: "subComments",
            populate: [
              { path: "author" },
              { path: "repliedOnComment", populate: { path: "author" } },
            ],
          },
        ],
      });

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    return res.json({
      message: "Post successfully found.",
      post: post, // Return the found post in the response
    });
  } catch (err) {
    return res.status(500).json({ error: "Не удалось найти посты." });
  }
};

export const getallposts = async (req, res) => {
  try {
    // Convert req.query.page to a number
    const page = parseInt(req.query.page, 10);
    const sortBy = req.query.sortBy || "date";
    const searchInput = req.query.search || '';
    let sortOptions = {};

    switch (sortBy) {
      case "-date":
        sortOptions = { createdAt: 1 }; // Sort from oldest to newest (ascending order)
        break;
      case "date":
        sortOptions = { createdAt: -1 }; // Sort from newest to oldest (descending order)
        break;
      case "-visits":
        sortOptions = { views: 1 }; // Sort by most views (descending order)
        break;
      case "visits":
        sortOptions = { views: -1 }; // Sort by least views (ascending order)
        break;
      case "-popularity":
        sortOptions = { likesCount: 1 }; // Sort by most likes (descending order)
        break;
      case "popularity":
        sortOptions = { likesCount: -1 }; // Sort by least likes (ascending order)
        break;
      case "-comments":
        sortOptions = { commentsCount: 1 }; // Sort by least comments (ascending order)
        break;
      case "comments":
        sortOptions = { commentsCount: -1 }; // Sort by most comments (descending order)
        break;
      default:
        // Default sorting by date in descending order
        sortOptions = { createdAt: -1 };
    }

    const searchRegex = new RegExp(searchInput, 'i'); // Создаем регулярное выражение для поиска с учетом регистра

    const posts = await Post.aggregate([
      // $match - это оператор агрегации в MongoDB, используемый для фильтрации документов в коллекции. Когда вы передаете пустой объект {} в $match, это означает, что вы не применяете никакой дополнительной фильтрации, и все документы из коллекции будут включены в результаты запроса.
      {
        $match: {
          title: { $regex: searchRegex } // Применяем фильтр поиска к полю title с использованием регулярного выражения
        },
      },
      // добавляем новые поля likesCount и commentsCount, которые содержат длину массивов likes и comments. Затем используем эти новые поля для сортировки.
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $sort: sortOptions,
      },
      {
        $skip: (page - 1) * 5,
      },
      {
        $limit: 5,
      },
    ]);

    // Если нам нужны полные данные, включая популяции, мы должны использовать populate после завершения агрегации. Мы можем добавить этап популяции после $limit:

    const populatedPosts = await Post.populate(posts, [
      { path: "author" },
      {
        path: "comments",
        populate: [
          { path: "author" },
          {
            path: "subComments",
            populate: [
              { path: "author" },
              { path: "repliedOnComment", populate: { path: "author" } },
            ],
          },
        ],
      },
    ]);
    // Без агрегации, но тогда мы не можем сортировать по полям likes, comments, т.к. как это массивы, нам нужно сначала узнать их длину, а потом уже сортировать
    // const posts = await Post.find()
    //   .sort(sortOptions)
    //   .skip((page - 1) * 5)
    //   .limit(5)
    //   .populate({
    //     path: "author",
    //   })
    //   .populate({
    //     path: "comments",
    //     populate: [
    //       { path: "author" },
    //       {
    //         path: "subComments",
    //         populate: [
    //           { path: "author" },
    //           { path: "repliedOnComment", populate: { path: "author" } },
    //         ],
    //       },
    //     ],
    //   });

    // Get the total count of all posts (чтобы посчитать сколько надо станиц пагинации)
    const totalPostsCount = await Post.countDocuments();

    return res.json({
      // message: "Posts successfully found.",
      // posts,
      posts: populatedPosts,
      quantity: totalPostsCount,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to find posts." });
  }
};

export const likepost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId).populate("author");

    if (!post) {
      return res.status(404).json({ error: "Пост не найден." });
    }

    // Check if the user has already liked the post
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // If the user has already liked the post, remove the userId from the likes array
      post.likes.pull(userId);
    } else {
      // If the user has not liked the post, add the userId to the likes array
      post.likes.push(userId);
    }

    // Save the updated post
    await post.save();

    // Update user's likedposts array based on the isLiked value
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден." });
    }

    if (isLiked) {
      // If the user has already liked the post, remove the postId from the likedposts array
      user.likedposts.pull(postId);
    } else {
      // If the user has not liked the post, add the postId to the likedposts array
      user.likedposts.push(postId);
    }

    // Save the updated user
    await user.save();

    return res.json({
      message: isLiked ? "Пост успешно анлайкнут." : "Пост успешно лайкнут.",
      post: post,
      user,
      isLiked: !isLiked,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Не удалось лайкнуть/анлайкнуть пост." });
  }
};

export const commentpost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.userId;
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post) {
      return res.status(404).json({ error: "Пост не найден." });
    }

    // create comment model
    const comment = new Comment({ author: user, post: post, text });
    // сохраним comment в БД
    await comment.save();

    // Add the full comment object to the post's comments array
    post.comments.push(comment);

    // Save the updated post
    await post.save();

    // Populate the comments array with the full comment objects and associated user information
    const populatedPost = await Post.findById(postId)
      // .populate("author")
      // .populate({
      //   path: "comments",
      //   populate: { path: "author" },
      // });
      .populate({
        path: "author",
      })
      .populate({
        path: "comments",
        populate: [
          { path: "author" },
          {
            path: "subComments",
            populate: [
              { path: "author" },
              { path: "repliedOnComment", populate: { path: "author" } },
            ],
          },
        ],
      });

    return res.json({
      message: "Комментарий успешно создан.",
      post: populatedPost,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Не удалось обновить просмотры поста." });
  }
};

export const subcommentpost = async (req, res) => {
  // const postId = req.params.id;
  const commentId = req.params.id;
  const userId = req.userId;
  const { text } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    const post = await Post.findById(comment.post);
    const user = await User.findById(userId);

    if (!comment) {
      return res.status(404).json({ error: "Комментарий не найден." });
    }
    if (!post) {
      return res.status(404).json({ error: "post не найден." });
    }
    if (!user) {
      return res.status(404).json({ error: "user не найден." });
    }

    const subcomment = new SubComment({
      author: user,
      repliedOnComment: comment,
      text,
    });
    await subcomment.save();

    comment.subComments.push(subcomment);

    await comment.save();

    const populatedComment = await Comment.findById(commentId)
      .populate("author")
      .populate("subComments")
      .populate({
        path: "subComments",
        populate: { path: "author" },
      });

    const populatedPost = await Post.findById(comment.post)
      .populate({
        path: "author",
      })
      .populate({
        path: "comments",
        populate: [
          { path: "author" },
          {
            path: "subComments",
            populate: [
              { path: "author" },
              { path: "repliedOnComment", populate: { path: "author" } },
            ],
          },
        ],
      });

    return res.json({
      message: "Ответ на комментарий успешно создан.",
      comment: populatedComment,
      populatedPost,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Не удалось создать ответ на комментарий" });
  }
};
