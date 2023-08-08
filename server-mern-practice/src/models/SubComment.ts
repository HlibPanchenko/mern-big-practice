import mongoose, { Document } from "mongoose";

interface ISubComment extends Document {
  author: mongoose.Types.ObjectId;
  repliedOnComment: mongoose.Types.ObjectId;
  text: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const subcommentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    repliedOnComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true } // Добавляем поля createdAt и updatedAt
);

const SubComment = mongoose.model<ISubComment>("SubComment", subcommentSchema);

export default SubComment;
// export default mongoose.model("Comment", commentSchema);
