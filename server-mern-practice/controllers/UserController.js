import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

export const register = async (req, res) => {
  try {
    console.log(req.body); // { email: 'почта12345', password: '12345' }

    //Смотрим есть ли ошибки при валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Uncorrect request", errors });
    }

    const { email, password } = req.body;
    // Проверяем есть ли уже зарегестрированный пользователь с такой почтой
    const alreadyRegistrated = await User.findOne({ email });

    if (alreadyRegistrated) {
      console.log("User already exists");
      return res.status(400).json({
        message: `User with email ${email} already exist`,
      });
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Создадим новго пользователя
    const user = new User({ email, password: hashPassword });

    // сохраним пользователя в БД
    await user.save();

    return res.status(200).json({
      message: "user was created",
      email,
      password: hashPassword,
    });
  } catch (error) {
    console.log(error);
    res.send({ message: "Failed to register" });
  }
};

export const login = async (req, res) => {
  try {
    // ищем пользователя в БД
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Пользователь с такой почтой не найден",
      });
    }
    // провереям правильно ли мы ввели пароль
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    // Если пароль неправильный
    if (!isValidPassword) {
      return res.status(404).json({
        message: "Неверный пароль ",
      });
    }
    // Достаем инфу о пользователе с БД
    const { email, password } = user;

    res.status(200).json({
      message: "login",
      email,
      password,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Такогопользователя не существует ",
    });
  }
};
