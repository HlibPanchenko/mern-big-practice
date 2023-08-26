import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import { IUserIdRequest } from "../utils/req.interface.js";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import jwt from "jsonwebtoken";
import config from "config";
import { uuid } from "uuidv4";
import { TYPES } from "../utils/types.js";
import { MailService } from "./MailService.js";
import { TokenService } from "./Token.service..js";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.MailService) private MailService: MailService,
    @inject(TYPES.TokenService) private TokenService: TokenService
  ) {}

  async registerService(email: string, password: string, name: string) {
    try {
      const alreadyRegistered = await User.findOne({ email });

      if (alreadyRegistered) {
        throw new Error(`User with email ${email} already exists`);
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const activationLink = uuid(); // ссылка для активации аккаунта
      //role
      const userRole = await Role.findOne({ value: "USER" });
      const adminRole = await Role.findOne({ value: "ADMIN" });
      const managerRole = await Role.findOne({ value: "MANAGER" });
      const superAdminRole = await Role.findOne({ value: "SUPERADMIN" });
      if (!userRole) {
        throw new Error(`such role doesn't exist`);
      }
      if (!adminRole) {
        throw new Error(`such role doesn't exist`);
      }
      if (!managerRole) {
        throw new Error(`such role doesn't exist`);
      }
      if (!superAdminRole) {
        throw new Error(`such role doesn't exist`);
      }
      const user = new User({
        email,
        password: hashPassword,
        name,
        activationLink,
        roles: [userRole.value],
        // roles: [userRole.value, managerRole.value, adminRole.value, superAdminRole.value],
      });
      const savedUser = await user.save();

      await this.MailService.sendActivationMail(
        email,
        `${config.get("API_URL")}/auth/activate/${activationLink}`
      );

      // const token = generateToken(savedUser._id, savedUser.roles);
      // const token = generateAccessToken(savedUser._id, savedUser.roles);
      const { accessToken, refreshToken } =
        await this.TokenService.generateTokens(
          savedUser._id,
          savedUser.roles,
          savedUser.isActivated,
          savedUser.email
        );
      // save refreshtoken to bd
      await this.TokenService.saveRefreshToken(savedUser._id, refreshToken);
      return {
        message: "User was created",
        user: savedUser,
        // ...savedUser.toJSON(),
        token: accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to register");
    }
  }
  async loginService(req: IUserIdRequest) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new Error("User with this email not found");
      }

      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      const { accessToken, refreshToken } =
        await this.TokenService.generateTokens(
          user._id,
          user.roles,
          user.isActivated,
          user.email
        );

      // save refreshtoken to bd
      await this.TokenService.saveRefreshToken(user._id, refreshToken);

      // const {
      //   email,
      //   name,
      //   avatar,
      //   _id,
      //   __v,
      //   likedposts,
      //   roles,
      //   activationLink,
      //   isActivated,
      // } = user;
      return {
        // email,
        // name,
        // avatar,
        // _id,
        // __v,
        // likedposts,
        // roles,
        // activationLink,
        // isActivated,
        user,
        token: accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to login");
    }
  }
  async getUserService(req: IUserIdRequest) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error("User not found");
      }
      // we will use it one time to create roles in bd
      // const userRole = new Role()
      // const adminRole = new Role({value:'MANAGER'})
      // save to bd
      // await userRole.save()
      // await adminRole.save()

      return {
        message: "User was got",
        ...user.toJSON(),
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get user");
    }
  }
  async updateUserService(req: IUserIdRequest) {
    try {
      let user = await User.findOneAndUpdate(
        { email: req.body.email },
        { name: req.body.name }
      );
      if (!user) {
        throw new Error("User with this email not found");
      }

      user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new Error("User with this email not found");
      }

      return {
        message: "User updated",
        ...user.toJSON(),
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to login");
    }
  }
  async activateUserService(activationLink: string) {
    try {
      const user = await User.findOne({ activationLink });
      if (!user) {
        throw new Error("User with this activationLink not found");
      }

      user.isActivated = true;
      await user.save();
    } catch (error) {
      console.log(error);
      throw new Error("Failed to activate user");
    }
  }
  async logOutService(refreshToken: string) {
    try {
      // delete refreshToken from DB
      const token = await this.TokenService.removeToken(refreshToken);
      return token;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to activate user");
    }
  }
  async refreshService(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new Error("there's no refreshToken");
      }
      const userData = await this.TokenService.validateRefreshToken(
        refreshToken
      );

      console.log('user data!!!!: ', userData);
      
      // проверяем есть ли токен в БД
      const tokenFromDB = await this.TokenService.findToken(refreshToken);
      console.log('token from db!!!!: ', tokenFromDB);
      
      if (!tokenFromDB || !userData) {
        throw new Error("User isn't authorized");
      }
      if (typeof userData !== "object" || !userData.id) {
        throw new Error("Invalid token payload");
      }

      const user = await User.findById(userData.id);
      console.log('user from db!!!!: ', user);

      if (!user) {
        throw new Error("Didn't find user");
      }
      const tokens = await this.TokenService.generateTokens(
        user._id,
        user.roles,
        user.isActivated,
        user.email
      );
      
      console.log('tokens: ', tokens);


      // save refreshtoken to bd
      await this.TokenService.saveRefreshToken(user._id, tokens.refreshToken);
      return { ...tokens, user };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to activate user");
    }
  }
}
