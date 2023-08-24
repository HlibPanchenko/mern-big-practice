import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { IUserIdRequest } from "../utils/req.interface.js";
import { UserService } from "../services/User.service.js";
import { HTTPError } from "../errors/http-error.class.js";
import { IUserController } from "./UserController.interface.js";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../utils/types.js";
import config from "config";

import {
  UpdateUserDTO,
  UserLoginDTO,
  UserRegistrationDTO,
} from "../dtos/user.dto.js";
import User from "../models/User.js";

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
@injectable()
export class UserController implements IUserController {
  // userService: UserService;

  constructor(@inject(TYPES.UserService) private userService: UserService) {
    // this.userService = userService;
    this.register = this.register.bind(this);
    this.getMe = this.getMe.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.login = this.login.bind(this); // привязываем методы класса к его экземплярам
    this.activateLink = this.activateLink.bind(this);
    this.logout = this.logout.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }

  async register(
    req: Request<{}, {}, UserRegistrationDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Uncorrect request", errors });
      }
      const { email, password, name } = req.body;
      // service
      const registrationResult = await this.userService.registerService(
        email,
        password,
        name
      );
      // сохраним рефреш токен в куки
      res.cookie("refreshToken", registrationResult.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // на 30 дней
        httpOnly: true,
      });
      return res.status(200).json(registrationResult);
    } catch (error) {
      next(new HTTPError(400, "Failed to register", "register"));
    }
  }

  async login(
    req: Request<{}, {}, UserLoginDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const loginResult = await this.userService.loginService(req);
      // сохраним рефреш токен в куки
      res.cookie("refreshToken", loginResult.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // на 30 дней
        httpOnly: true,
      });
      return res.status(200).json({
        ...loginResult,
      });
    } catch (error) {
      next(new HTTPError(401, "User doesn't exist", "login"));
    }
  }

  async getMe(req: IUserIdRequest, res: Response) {
    try {
      const getUserResult = await this.userService.getUserService(req);
      return res.status(200).json(getUserResult);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "No access",
      });
    }
  }
  async getAllUsers(req: IUserIdRequest, res: Response) {
    try {
      const users = await User.find();
      if (!users) {
        throw new Error("User not found");
      }

      // const superadmin = new Role({value:"SUPERADMIN"})
      // await superadmin.save()

      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "No access",
      });
    }
  }

  async updateUser(req: Request<{}, {}, UpdateUserDTO>, res: Response) {
    try {
      const updateUserResult = await this.userService.updateUserService(req);
      return res.status(200).json(updateUserResult);
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "User doesn't exist",
      });
    }
  }
  async upUserRole(req: IUserIdRequest, res: Response) {
    try {
      const IdUserToBeUpdated = req.params.id;
      const userId = req.userId;
      // const UserToBeUpdated = await User.findByIdAndUpdate()
      if (!userId) {
        return res.status(400).json({
          message: "no userId",
        });
      }
      // console.log(IdUserToBeUpdated);

      const UserToBeUpdated = await User.findById(IdUserToBeUpdated);
      if (!UserToBeUpdated) {
        return res.status(400).json({
          message: "User doesn't exist",
        });
      }
      const newRole =
        UserToBeUpdated.roles[UserToBeUpdated.roles.length - 1] === "USER"
          ? "MANAGER"
          : "ADMIN";

      UserToBeUpdated.roles.push(newRole); // Добавляем новую роль в массив
      await UserToBeUpdated.save(); // Сохраняем обновленного пользователя

      const users = await User.find();
      if (!users) {
        throw new Error("User not found");
      }

      res.status(200).json({
        message: "User role updated successfully",
        // updatedUser: UserToBeUpdated,
        users,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "User doesn't exist",
      });
    }
  }
  async downUserRole(req: IUserIdRequest, res: Response) {
    try {
      const IdUserToBeUpdated = req.params.id;
      const userId = req.userId;
      // const UserToBeUpdated = await User.findByIdAndUpdate()
      if (!userId) {
        return res.status(400).json({
          message: "no userId",
        });
      }

      const UserToBeUpdated = await User.findById(IdUserToBeUpdated);
      if (!UserToBeUpdated) {
        return res.status(400).json({
          message: "User doesn't exist",
        });
      }

      UserToBeUpdated.roles.pop(); // Удаляем последний элемент из массива
      await UserToBeUpdated.save(); // Сохраняем обновленного пользователя

      const users = await User.find();
      if (!users) {
        throw new Error("Users not found");
      }

      res.status(200).json({
        message: "User role updated successfully",
        users,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "User doesn't exist",
      });
    }
  }
  async logout(req: IUserIdRequest, res: Response) {
    try {
      // из куки достаем рефреш токен
      const { refreshToken } = req.cookies;
      const logoutResult = await this.userService.logOutService(refreshToken);
      // удаляем куки
      res.clearCookie("refreshToken");
      res.status(200).json({
        message: "Successfully logged out",
        logoutResult,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Didn't manage to log out",
      });
    }
  }
  async activateLink(req: IUserIdRequest, res: Response) {
    try {
      const activationLink = req.params.link;
      await this.userService.activateUserService(activationLink);
      // после того как пользователь перешел по нашей ссылке, его надо редиректнуть на фронтенд
      const frontendLink = config.get("API_CLIENT_URL") as string;
      return res.redirect(frontendLink);
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Didn't manage to activate user",
      });
    }
  }
  async refreshToken(req: IUserIdRequest, res: Response) {
    try {
      // из куки достаем рефреш токен
      const { refreshToken } = req.cookies;
      const refreshResult = await this.userService.refreshService(refreshToken);
      // сохраним рефреш токен в куки
      res.cookie("refreshToken", refreshResult.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // на 30 дней
        httpOnly: true,
      });
      return res.status(200).json({
        ...refreshResult,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "User doesn't exist",
      });
    }
  }
}
