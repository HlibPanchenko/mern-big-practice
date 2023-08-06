import { Request } from "express";
export interface IUserIdRequest extends Request {
  userId?: string; // поставил "?" и перестало ругаться на checkAuth в роутах
}
