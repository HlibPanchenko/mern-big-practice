import express from "express";
const postRouter = express.Router();
import * as PostController from "../controllers/PostController.js";
import { checkAuth } from "../utils/checkAuth.js";
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

postRouter.get("/getonepost/:id", checkAuth, PostController.getonepost);

postRouter.get("/getallposts", checkAuth, PostController.getallposts);
postRouter.post("/likepost/:id", checkAuth, PostController.likepost);

postRouter.post("/comment/:id", checkAuth, PostController.commentpost);
postRouter.post("/subcomment/:id", checkAuth, PostController.subcommentpost);

export { postRouter };
