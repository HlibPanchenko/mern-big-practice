import mongoose from "mongoose";

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

const SubComment = mongoose.model("SubComment", subcommentSchema);

export default SubComment;
// export default mongoose.model("Comment", commentSchema);
