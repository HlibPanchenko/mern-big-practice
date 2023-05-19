import express from "express";
const authRouter = express.Router();
import * as UserController from "../controllers/UserController.js";
import { check } from "express-validator";

authRouter.post(
  "/registration",
  [
    check("email", "Please enter your email address in format yourname@example.com").isEmail(),
    // check("password", "password must have 5+ symbols").isLength({ min: 5 }),
  ],
  UserController.register
);

authRouter.post("/login", UserController.login);

export { authRouter };
