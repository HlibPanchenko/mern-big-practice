import express from "express";
const postRouter = express.Router();
import * as PostController from "../controllers/PostController.js";
import checkAuth from "../utils/checkAuth.js";

postRouter.post("/create", checkAuth, PostController.createPost);

export { postRouter };
