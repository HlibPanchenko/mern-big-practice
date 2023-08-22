import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateJWTToken.js";
import { IUserIdRequest } from "../utils/req.interface.js";
import "reflect-metadata";
import { injectable } from "inversify";
import jwt from 'jsonwebtoken';
import config from "config";

const generateAccessToken = (id:any, roles:any) => {
  const secret = config.get('secret') as string
  const payload = {
      id,
      roles
  }
  return jwt.sign(payload, secret, {expiresIn: "24h"} )
}

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
      //role
      const userRole = await Role.findOne({ value: "USER" });
      const adminRole = await Role.findOne({ value: "ADMIN" });
      const managerRole = await Role.findOne({ value: "MANAGER" });
      const superAdminRole = await Role.findOne({value:"SUPERADMIN"});
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
        roles: [userRole.value]
        // roles: [userRole.value, managerRole.value, adminRole.value, superAdminRole.value],
      });
      const savedUser = await user.save();

      // const token = generateToken(savedUser._id, savedUser.roles);
      const token = generateAccessToken(savedUser._id, savedUser.roles);

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

      // const token = generateToken(user._id, user.roles);
      const token = generateAccessToken(user._id, user.roles);

      const { email, name, avatar, _id, __v, likedposts, roles } = user;
      return {
        message: "Login successful",
        email,
        name,
        avatar,
        _id,
        __v,
        token,
        likedposts,
        roles
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
}
