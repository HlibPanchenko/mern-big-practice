import mongoose from "mongoose";

const User = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: "" }, // Указываем значение по умолчанию как пустую строку
});

export default mongoose.model("User", User);
