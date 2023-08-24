import User from "../models/User.js";
import "reflect-metadata";
import { injectable } from "inversify";
import nodemailer from "nodemailer";
import config from "config";

@injectable()
export class MailService {
  private transporter;

  constructor() {
    // Создайте транспорт SMTP
    this.transporter = nodemailer.createTransport({
      host: config.get("SMTP"), // замените на ваш SMTP-сервер
      port: config.get("SMTP_PORT"),
      secure: false, // true для 465 порта, false для других портов
      // аккаунт с которого мы будем отправлять письма
      auth: {
        user: config.get("SMTP_USER"), // ваш e-mail
        pass: config.get("SMTP_PASSWORD"), // ваш пароль от e-mail
      },
    });
  }

  async sendActivationMail(email: string, link: string) {
    try {
      const mailOptions = {
        from: config.get("SMTP_USER") as string, // адрес отправителя
        to: email, // список получателей
        subject: "Activation Link from CarFromTheStreet", // тема письма
        text: `Hello, please use the following link to activate your account: ${link}`, // текст письма
        html: `<p>Hello, please click the following link to activate your account: <a href="${link}">Activate</a></p>`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to send mail");
    }
  }
}
