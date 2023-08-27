import mongoose, { Document } from "mongoose";
import { IUser } from "./User";

// export interface IArchievePost extends Document {
//   originalPost: mongoose.Types.ObjectId;
//   initiatedPerson: mongoose.Types.ObjectId;
//   createdAt: Date;
//   updatedAt: Date;
//   __v: number;
// }

export interface IArchievePost extends Document {
  originalPost: {
    author: IUser["_id"];
    title: string;
    description: string;
    images: string[];
    likes: IUser["_id"][];
    views: number;
    comments: mongoose.Types.Array<mongoose.Schema.Types.ObjectId>;
    date: Date;
  };
  initiatedPerson: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const archievePostSchema = new mongoose.Schema(
  {
    originalPost: {
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      title: String,
      description: String,
      images: [String],
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      views: Number,
      comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
      date: Date,
    },
    // originalPost: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Post",
    //   required: true,
    // },
    initiatedPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ArchievePost = mongoose.model(
  "ArchievePost",
  archievePostSchema
);

export default ArchievePost;
