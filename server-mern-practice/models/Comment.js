import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    subComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubComment" }],
  },
  { timestamps: true } // Добавляем поля createdAt и updatedAt
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
// export default mongoose.model("Comment", commentSchema);
