import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    // если токен есть, его надо расшифровать
    try {
      const decoded = jwt.verify(token, "secret123");
      // вшиваем расшифрованный Id с токена в req
      // чтобы использовать его в следующем контроллере
      req.userId = decoded.userId;
      next(); // без нее бесконечно грузился запрос
    } catch (error) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа",
    });
  }
};
