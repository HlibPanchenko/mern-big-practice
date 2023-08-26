import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUserIdRequest } from "./req.interface.js";
import config from "config";

interface JwtPayload {
  // userId: string;
  id: string;
  roles: string[];
}

// export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
export const checkAuth = (
  req: IUserIdRequest,
  res: Response,
  next: NextFunction
) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  console.log(token);
  console.log(req.headers.authorization);
  
  if (token) {
    try {
      const secret = config.get("JWT_ACCESS_SECRET") as string;
      const decoded = jwt.verify(token, secret) as JwtPayload;
      req.userId = decoded.id;
      next();
    } catch (error) {
      console.log(error);

      return res.status(401).json({
        message: "Нет доступа(",
      });
    }
  } else {
    return res.status(401).json({
      message: "Нет доступа",
    });
  }
};
