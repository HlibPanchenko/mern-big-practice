import express from "express";
const postRouter = express.Router();
import * as PostController from "../controllers/PostController.js";
import checkAuth from "../utils/checkAuth.js";
import { upload } from "../utils/multerConfig.js";

postRouter.post(
  "/create",
  checkAuth,
  upload.array("images[]", 10),
  PostController.createPost
);

postRouter.get(
  "/getallauthorposts",
  checkAuth,
  PostController.getallauthorposts
);

export { postRouter };
