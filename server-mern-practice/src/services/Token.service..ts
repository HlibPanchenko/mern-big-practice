import Token from "../models/token-model.js";
import "reflect-metadata";
import { injectable } from "inversify";
import config from "config";
import jwt from "jsonwebtoken";

@injectable()
export class TokenService {
  async generateTokens(
    id: string,
    roles: string[],
    isActivated: boolean,
    email: string
  ) {
    try {
      const secretAccess = config.get("JWT_ACCESS_SECRET") as string;
      const secretRefresh = config.get("JWT_REFRESH_SECRET") as string;
      const payload = {
        id,
        roles,
        email,
        isActivated,
      };
      const accessToken = jwt.sign(payload, secretAccess, { expiresIn: "1m" });
      const refreshToken = jwt.sign(payload, secretRefresh, {
        expiresIn: "30d",
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to generate AccessToken");
    }
  }

  // функция сохранения рефреш токена в БД
  async saveRefreshToken(userId: string, refreshToken: string) {
    try {
      // проверяем есть ли в БД по такому id токен
      const tokenData = await Token.findOne({ user: userId });
      // если есть, то перезаписываем рефрше токен
      console.log("token in bd:", tokenData);

      if (tokenData) {
        tokenData.refreshToken = refreshToken;
        const updatedRefreshToken = await tokenData.save();
        console.log("updated token in bd:", updatedRefreshToken);
        return;
      }
      // если нету, значит пользователь логинится первый раз
      const newToken = new Token({ user: userId, refreshToken });
      return newToken.save();
    } catch (error) {
      console.log(error);
      throw new Error("Failed to generate AccessToken");
    }
  }
  async removeToken(refreshToken: string) {
    try {
      const tokenData = await Token.deleteOne({ refreshToken });
      return tokenData;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to generate AccessToken");
    }
  }
  async findToken(refreshToken: string) {
    try {
      const tokenData = await Token.findOne({ refreshToken });
      return tokenData;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to generate AccessToken");
    }
  }
  async validateAccessToken(token: string) {
    try {
      const secretAccess = config.get("JWT_ACCESS_SECRET") as string;
      const userData = jwt.verify(token, secretAccess);
      return userData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async validateRefreshToken(token: string) {
    try {
      const secretRefresh = config.get("JWT_REFRESH_SECRET") as string;
      const userData = jwt.verify(token, secretRefresh);
      console.log(userData);

      return userData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
