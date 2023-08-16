import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateJWTToken.js";
import { IUserIdRequest } from "../utils/req.interface.js";
import "reflect-metadata";
import { injectable } from "inversify";

@injectable()
export class UserService {
  async registerService(email: string, password: string, name: string) {
    try {
      const alreadyRegistered = await User.findOne({ email });

      if (alreadyRegistered) {
        throw new Error(`User with email ${email} already exists`);
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const user = new User({ email, password: hashPassword, name });
      const savedUser = await user.save();

      const token = generateToken(savedUser._id);

      return {
        message: "User was created",
        ...savedUser.toJSON(),
        token,
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

      const token = generateToken(user._id);

      const { email, name, avatar, _id, __v, likedposts } = user;
      return {
        message: "Login successful",
        email,
        name,
        avatar,
        _id,
        __v,
        token,
        likedposts,
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
}
