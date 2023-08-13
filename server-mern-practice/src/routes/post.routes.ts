import express, { Router } from "express";
import { RequestHandler } from "express";
import {
  // ICreatePostRequest,
  PostController,
} from "../controllers/PostController.js";
import { checkAuth } from "../utils/checkAuth.js";
import { UploadService } from "../services/multer.service.js";

// functional
// const postRouter = express.Router();
// postRouter.post(
//   "/create",
//   checkAuth,
//   upload.array("images[]", 10),
//   PostController.createPost
// );

// postRouter.get(
//   "/getallauthorposts",
//   checkAuth,
//   PostController.getallauthorposts
// );

// postRouter.get("/getonepost/:id", checkAuth, PostController.getonepost);

// postRouter.get("/getallposts", checkAuth, PostController.getallposts);
// postRouter.post("/likepost/:id", checkAuth, PostController.likepost);

// postRouter.post("/comment/:id", checkAuth, PostController.commentpost);
// postRouter.post("/subcomment/:id", checkAuth, PostController.subcommentpost);

// export { postRouter };

// OOP
export class PostRouter {
  private router: Router;
  private postController: PostController;
  private multerService: UploadService;

  constructor(postController: PostController, multerService: UploadService) {
    this.router = Router();
    this.postController = postController;
    this.multerService = multerService;

    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post(
      "/create",
      checkAuth,
      this.multerService.array("images[]", 10),
      // upload.array("images[]", 10),
      this.postController.createPost
    );

    this.router.get(
      "/getallauthorposts",
      checkAuth,
      this.postController.getallauthorposts
    );

    this.router.get(
      "/getonepost/:id",
      checkAuth,
      this.postController.getonepost
    );

    this.router.get("/getallposts", checkAuth, this.postController.getallposts);
    this.router.post("/likepost/:id", checkAuth, this.postController.likepost);

    this.router.post(
      "/comment/:id",
      checkAuth,
      this.postController.commentpost
    );
    this.router.post(
      "/subcomment/:id",
      checkAuth,
      this.postController.subcommentpost
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
