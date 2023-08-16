import express, { Router } from "express";
import {UserController} from "../controllers/UserController.js";
import { check } from "express-validator";
import {checkAuth} from "../utils/checkAuth.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../utils/types.js";
import { IUserController } from "../controllers/UserController.interface.js";
import "reflect-metadata";

// const authRouter = express.Router();

// authRouter.post(
//   "/registration",
//   [
//     check(
//       "email",
//       "Please enter your email address in format yourname@example.com"
//     ).isEmail(),
//     // check("password", "password must have 5+ symbols").isLength({ min: 5 }),
//   ],
//   UserController.register
// );

// authRouter.post("/login", UserController.login);

// authRouter.get("/getuser", checkAuth , UserController.getMe);

// authRouter.post("/updateuser", checkAuth , UserController.updateUser);

// export { authRouter };
@injectable()
export class AuthRouter {
  private router: Router;
  // private userController: UserController;

  constructor(@inject(TYPES.IUserController) private userController: IUserController) {
    this.router = Router();
    // this.userController = userController;
    this.configureRoutes();

  }

  private configureRoutes(): void {
    this.router.post(
      "/registration",
      [
        check(
          "email",
          "Please enter your email address in format yourname@example.com"
        ).isEmail(),
        // check("password", "password must have 5+ symbols").isLength({ min: 5 }),
      ],
      this.userController.register
    );

    this.router.post("/login", this.userController.login);
    this.router.get("/getuser", checkAuth, this.userController.getMe);
    this.router.post("/updateuser", checkAuth, this.userController.updateUser);
  }

  public getRouter(): Router {
    return this.router;
  }
}