import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUserIdRequest } from "./req.interface.js"
import config from "config";

interface JwtPayload {
  // userId: string;
  id: string;
  roles: string[]
}

// export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
export const checkAuth = (req: IUserIdRequest, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  // console.log(req.headers.authorization);
  
  if (token) {
    // если токен есть, его надо расшифровать
    try {
      // const decoded = jwt.verify(token, "secret123");
      // вшиваем расшифрованный Id с токена в req
      // чтобы использовать его в следующем контроллере
      // req.userId = decoded.userId;
      const secret = config.get('JWT_ACCESS_SECRET') as string

      const decoded = jwt.verify(token, secret) as JwtPayload;
      // console.log(decoded);
      
      req.userId = decoded.id;
      // req.userId = decoded.userId;
      next(); // без нее бесконечно грузился запрос
    } catch (error) {
      console.log(error);
      
      return res.status(403).json({
        message: "Нет доступа(",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа",
    });
  }
};
