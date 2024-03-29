import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  avatar: string;
  likedposts: string[];
  isActivated: boolean;
  activationLink: string;
  roles: string[];
}

const User = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: "" }, // Указываем значение по умолчанию как пустую строку
  likedposts: [{ type: String }],
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  roles: [{ type: String, ref: "Role" }],
});

export default mongoose.model<IUser>("User", User);
