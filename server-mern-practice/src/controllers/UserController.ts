import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateJWTToken.js";
import { IUserIdRequest } from "../utils/req.interface.js";

// export const register = async (req: Request, res: Response) => {
//   try {
//     //Смотрим есть ли ошибки при валидации
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ message: "Uncorrect request", errors });
//     }
//     console.log(req.body);
//     const { email, password, name } = req.body;
//     // Проверяем есть ли уже зарегестрированный пользователь с такой почтой
//     const alreadyRegistrated = await User.findOne({ email });

//     if (alreadyRegistrated) {
//       console.log("User already exists");
//       return res.status(400).json({
//         message: `User with email ${email} already exist`,
//       });
//     }

//     // Хешируем пароль
//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(password, salt);

//     // Создадим новго пользователя
//     const doc = new User({ email, password: hashPassword, name });

//     // сохраним пользователя в БД
//     // и уже пользователя с бд положим в перемменную (у него будет поле _id, которое дает нам MongoDb)
//     const user = await doc.save();
//     console.log(user);
//     // console.log(user._doc);
//     // Генерация JWT токена
//     const token = generateToken(user._id);

//     return res.status(200).json({
//       message: "user was created",
//       // ...user._doc,
//       ...user.toJSON(), // Вместо user._doc
//       token,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       message: "Failed to register ",
//     });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   try {
//     // ищем пользователя в БД
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(404).json({
//         message: "Пользователь с такой почтой не найден",
//       });
//     }

//     console.log(user);
//     // провереям правильно ли мы ввели пароль
//     const isValidPassword = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     // Если пароль неправильный
//     if (!isValidPassword) {
//       return res.status(404).json({
//         message: "Неверный пароль ",
//       });
//     }

//     // Генерация JWT токена
//     const token = generateToken(user._id);

//     // Достаем инфу о пользователе с БД
//     const { email, password, name, avatar, _id, __v, likedposts } = user;

//     res.status(200).json({
//       message: "login",
//       email,
//       password,
//       name,
//       avatar,
//       _id,
//       __v,
//       token,
//       likedposts,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       message: "Такогопользователя не существует ",
//     });
//   }
// };

// export const getMe = async (req: IUserIdRequest, res: Response) => {
//   try {
//     // ищем по Id с токена, который расшифровали, достали с него id
//     // вшили в req в middleware checkauth
//     const user = await User.findById(req.userId);

//     if (!user) {
//       return res.status(404).json({
//         message: "нет такого пользователя",
//       });
//     }

//     // вытаскиваем информацию о пользователе
//     // const { passwordHash, ...userData } = user._doc;

//     // вернем информацию о пользователе и токен
//     // res.json(userData);
//     res.json(user.toJSON()); // Вместо user._doc
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "нет доступа",
//     });
//   }
// };

// export const updateUser = async (req: Request, res: Response) => {
//   try {
//     // ищем пользователя в БД
//     // const user = await User.findOne({ email: req.body.email });
//     let user = await User.findOneAndUpdate(
//       { email: req.body.email },
//       { name: req.body.name }
//     );
//     if (!user) {
//       return res.status(404).json({
//         message: "Пользователь с такой почтой не найден",
//       });
//     }

//     console.log(user);

//     // получаем обновленного пользователя
//     user = await User.findOne({ email: req.body.email });

//     if (!user) {
//       return res.status(404).json({
//         message: "Пользователь с такой почтой не найден",
//       });
//     }

//     res.status(200).json({
//       message: "edited",
//       // ...user._doc,
//       ...user.toJSON(), // Вместо user._doc
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       message: "Такого пользователя не существует ",
//     });
//   }
// };


export class UserController {
  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Uncorrect request", errors });
      }

      const { email, password, name } = req.body;
      const alreadyRegistered = await User.findOne({ email });

      if (alreadyRegistered) {
        return res.status(400).json({
          message: `User with email ${email} already exists`,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const user = new User({ email, password: hashPassword, name });
      const savedUser = await user.save();

      const token = generateToken(savedUser._id);

      return res.status(200).json({
        message: "User was created",
        ...savedUser.toJSON(),
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Failed to register",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({
          message: "User with this email not found",
        });
      }

      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isValidPassword) {
        return res.status(404).json({
          message: "Invalid password",
        });
      }

      const token = generateToken(user._id);

      const { email, name, avatar, _id, __v, likedposts } = user;
      res.status(200).json({
        message: "Login successful",
        email,
        name,
        avatar,
        _id,
        __v,
        token,
        likedposts,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "User doesn't exist",
      });
    }
  }

  async getMe(req: IUserIdRequest, res: Response) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(user.toJSON());
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "No access",
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      let user = await User.findOneAndUpdate(
        { email: req.body.email },
        { name: req.body.name }
      );
      if (!user) {
        return res.status(404).json({
          message: "User with this email not found",
        });
      }

      user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({
          message: "User with this email not found",
        });
      }

      res.status(200).json({
        message: "User updated",
        ...user.toJSON(),
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "User doesn't exist",
      });
    }
  }
}


