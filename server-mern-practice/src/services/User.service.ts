import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateJWTToken.js";
import { IUserIdRequest } from "../utils/req.interface.js";
import { Response } from "express";

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
  async loginService(req:IUserIdRequest, res: Response) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({
          message: "User with this email not found",
        });
      }

      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isValidPassword) {
        return res.status(404).json({
          message: "Invalid password",
        });
      }

      const token = generateToken(user._id);

      const { email, name, avatar, _id, __v, likedposts } = user;
      res.status(200).json({
        message: "Login successful",
        email,
        name,
        avatar,
        _id,
        __v,
        token,
        likedposts,
      });
    } catch (error) {
      console.log(error);
      throw new Error("Failed to login");
    }
  }
  async getUserService(req:IUserIdRequest, res: Response) {
    try {
		const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(user.toJSON());
    } catch (error) {
      console.log(error);
      throw new Error("Failed to login");
    }
  }
  async updateUserService(req:IUserIdRequest, res: Response) {
    try {
		let user = await User.findOneAndUpdate(
			{ email: req.body.email },
			{ name: req.body.name }
		 );
		 if (!user) {
			return res.status(404).json({
			  message: "User with this email not found",
			});
		 }
 
		 user = await User.findOne({ email: req.body.email });
		 if (!user) {
			return res.status(404).json({
			  message: "User with this email not found",
			});
		 }
 
		 res.status(200).json({
			message: "User updated",
			...user.toJSON(),
		 });
    } catch (error) {
      console.log(error);
      throw new Error("Failed to login");
    }
  }
}
