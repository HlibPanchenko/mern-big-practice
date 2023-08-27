import path from "path";
import config from "config";
import fs from "fs";
import { IUserIdRequest } from "../utils/req.interface.js";
import { Response, Request } from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import SubComment from "../models/SubComment.js";
import "reflect-metadata";
import { injectable } from "inversify";
import ArchievePost from "../models/ArchivePost.js";

@injectable()
export class PostService {
  async createPostService(req: Request) {
    try {
      const typedReq = req as IUserIdRequest & { files: Express.Multer.File[] };

      const { text, description } = req.body;
      const userId = typedReq.userId;
      // const userId = req.userId;
      if (!userId) {
        throw new Error("User ID not provided.");
      }

      // const user = await User.findById(typedReq.userId);
      const user = await User.findById(userId);

      // Создаем запись о посте в базе данных
      const post = await Post.create({
        author: user,
        title: text,
        description,
        images: [], // Мы добавим пути к изображениям позже
      });

      // Изображения успешно загружены
      // const imagePaths = req.files.map((file: Express.Multer.File) =>
      const imagePaths = typedReq.files.map(
        (file: Express.Multer.File) => path.join(userId, text, file.filename)
        //   path.join(userSubFolderPath, file.filename)
      );

      const newPost = await Post.findByIdAndUpdate(
        post._id,
        { images: imagePaths },
        { new: true }
      ).exec();

      if (!newPost) {
        throw new Error("Post not found.");
      }

      return {
        message: "Пост успешно создан.",
        post: newPost,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create post");
    }
  }
  async getallauthorpostsService(req: IUserIdRequest) {
    try {
      const posts = await Post.find({ author: req.userId }).populate("author");

      return {
        message: "Посты автора успешно найдены.",
        posts,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get all authtor's posts");
    }
  }
  async getonepostService(req: IUserIdRequest) {
    try {
      const userId = req.userId; // Получение ID пользователя
      const postId = req.params.id;
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
        throw new Error("Post not found");
      }
      return {
        message: "Post successfully found.",
        post: post, // Return the found post in the response
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get one specific post");
    }
  }
  async getallpostsService(req: IUserIdRequest) {
    try {
      // Convert req.query.page to a number
      const page = parseInt(req.query.page as string, 10);
      const sortBy = req.query.sortBy || "date";
      const searchInput = req.query.search || "";
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

      const searchRegex = new RegExp(searchInput as string, "i"); // Создаем регулярное выражение для поиска с учетом регистра

      const posts = await Post.aggregate([
        // $match - это оператор агрегации в MongoDB, используемый для фильтрации документов в коллекции. Когда вы передаете пустой объект {} в $match, это означает, что вы не применяете никакой дополнительной фильтрации, и все документы из коллекции будут включены в результаты запроса.
        {
          $match: {
            title: { $regex: searchRegex }, // Применяем фильтр поиска к полю title с использованием регулярного выражения
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

      return {
        posts: populatedPosts,
        quantity: totalPostsCount,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get all posts");
    }
  }
  async likepostService(req: IUserIdRequest) {
    try {
      const postId = req.params.id;
      const userId = req.userId;
      const post = await Post.findById(postId).populate("author");

      if (!post) {
        throw new Error("Failed to find post to be liked");
      }

      if (!userId) {
        throw new Error("User ID not provided");
      }

      // Check if the user has already liked the post
      const isLiked = post.likes.includes(userId);

      if (isLiked) {
        // If the user has already liked the post, remove the userId from the likes array
        // post.likes.pull(userId);
        post.likes = post.likes.filter((likeUserId) => likeUserId !== userId);
      } else {
        // If the user has not liked the post, add the userId to the likes array
        post.likes.push(userId);
      }

      // Save the updated post
      await post.save();

      // Update user's likedposts array based on the isLiked value
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Failed to find the user");
      }

      if (isLiked) {
        // If the user has already liked the post, remove the postId from the likedposts array
        // user.likedposts.pull(postId);
        user.likedposts = user.likedposts.filter(
          (likedPostId) => likedPostId !== postId
        );
      } else {
        // If the user has not liked the post, add the postId to the likedposts array
        user.likedposts.push(postId);
      }

      // Save the updated user
      await user.save();

      return {
        message: isLiked ? "Пост успешно анлайкнут." : "Пост успешно лайкнут.",
        post: post,
        user,
        isLiked: !isLiked,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to like the post");
    }
  }
  async archivePostService(req: IUserIdRequest) {
    try {
      const postId = req.params.id;
      const userId = req.userId;
      const post = await Post.findById(postId);
      // const post = await Post.findById(postId).populate("author");

      if (!post) {
        throw new Error("Failed to find post to be liked");
      }

      if (!userId) {
        throw new Error("User ID not provided");
      }

      const archievedPost = new ArchievePost({
        // originalPost: post._id,
        originalPost: {
          // Копируем соответствующие поля из исходного поста
          author: post.author,
          title: post.title,
          description: post.description,
          images: [...post.images],
          likes: [...post.likes],
          views: post.views,
          comments: [...post.comments],
          date: post.date,
        },
        initiatedPerson: userId,
      });

      await archievedPost.save();

      // Remove the original post
      await Post.deleteOne({ _id: post._id });

      return {
        message: "The post was archieved",
        archievedPost,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to archieve post");
    }
  }
  async commentpostService(req: IUserIdRequest) {
    try {
      const postId = req.params.id;
      const userId = req.userId;
      const { text } = req.body;
      const post = await Post.findById(postId);
      const user = await User.findById(userId);

      if (!post) {
        throw new Error("Post not found to be commented");
      }

      // create comment model
      const comment = new Comment({ author: user, post: post, text });
      // сохраним comment в БД
      await comment.save();

      // Add the full comment object to the post's comments array
      // post.comments.push(comment);
      post.comments.push(comment._id); // Push the comment's ObjectId to the array

      // Save the updated post
      await post.save();

      // Populate the comments array with the full comment objects and associated user information
      const populatedPost = await Post.findById(postId)
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
      return {
        message: "Комментарий успешно создан.",
        post: populatedPost,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to comment the post");
    }
  }
  async subcommentpostService(req: IUserIdRequest) {
    try {
      const commentId = req.params.id;
      const userId = req.userId;
      const { text } = req.body;
      const comment = await Comment.findById(commentId);
      // const post = await Post.findById(comment.post);
      const user = await User.findById(userId);

      if (!comment) {
        throw new Error("Failed to find the comment to be subcommented");
      }

      if (!user) {
        throw new Error("Failed to find the user who wants to comment");
      }

      const subcomment = new SubComment({
        author: user,
        repliedOnComment: comment,
        text,
      });
      await subcomment.save();

      // comment.subComments.push(subcomment);
      comment.subComments.push(subcomment._id);

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

      return {
        message: "Ответ на комментарий успешно создан.",
        comment: populatedComment,
        populatedPost,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to subcomment");
    }
  }
}
