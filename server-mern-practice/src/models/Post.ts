import mongoose, { Document } from "mongoose";
import { IUser } from "./User.js"; 

export interface IPost extends Document {
  author: IUser["_id"];
  title: string;
  description: string;
  images: string[];
  likes: IUser["_id"][];
  views: number;
  comments: mongoose.Types.Array<mongoose.Schema.Types.ObjectId>;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    // likes: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    comments:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true } // Добавляем поля createdAt и updatedAt
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
// export default mongoose.model("Post", Post);
