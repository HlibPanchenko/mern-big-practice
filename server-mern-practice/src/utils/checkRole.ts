import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IUserIdRequest } from "./req.interface";
import config from "config";

interface JwtPayload {
	userId: string;
	roles: string[]
 }
export function checkRole(requiredRoles:string[]) {
  return function (req: IUserIdRequest, res: Response, next: NextFunction) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

      if (!token) {
        return res.status(403).json({ message: "Пользователь не авторизован" });
      }
      const secret = config.get('secret') as string

      const { roles } = jwt.verify(token, secret) as JwtPayload;
		console.log(roles);
    let hasAllRoles = requiredRoles.some(role => roles.includes(role));

      if (!hasAllRoles) {
        return res.status(403).json({ message: "User doesn't have the required permissions" });
      }
      next();
    } catch (e) {
      console.log(e);
      return res.status(403).json({ message: "error in checkrole" });
    }
  };
}
