import mongoose from "mongoose";

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
    likes: [{ type: String }],
    // likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    comments: [{ type: String }],
  },
  { timestamps: true } // Добавляем поля createdAt и updatedAt
);

const Post = mongoose.model("Post", postSchema);

export default Post;
// export default mongoose.model("Post", Post);
