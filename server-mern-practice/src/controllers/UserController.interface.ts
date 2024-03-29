import { Request, Response, NextFunction } from "express";
import { IUserIdRequest } from "../utils/req.interface.js";

interface IUserController {
  register: (req: Request, res: Response, next: NextFunction) => void;
  login: (req: Request, res: Response, next: NextFunction) => void;
  getMe: (req: IUserIdRequest, res: Response) => void;
  getAllUsers: (req: IUserIdRequest, res: Response) => void;
  updateUser: (req: Request, res: Response) => void;
  upUserRole: (req: Request, res: Response) => void;
  downUserRole: (req: Request, res: Response) => void;
  logout: (req: Request, res: Response) => void;
  activateLink: (req: Request, res: Response) => void;
  refreshToken: (req: Request, res: Response) => void;
}

export { IUserController };
