import express, { Router } from "express";
import {PostController} from "../controllers/PostController.js";
import { checkAuth } from "../utils/checkAuth.js";
import { upload } from "../utils/multerConfig.js";

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

  constructor(postController: PostController) {
    this.router = Router();
    this.postController = postController;
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post(
      "/create",
      checkAuth,
      upload.array("images[]", 10),
      this.postController.createPost
    );
    
    this.router.get(
      "/getallauthorposts",
      checkAuth,
      this.postController.getallauthorposts
    );
    
    this.router.get("/getonepost/:id", checkAuth, this.postController.getonepost);
    
    this.router.get("/getallposts", checkAuth, this.postController.getallposts);
    this.router.post("/likepost/:id", checkAuth, this.postController.likepost);
    
    this.router.post("/comment/:id", checkAuth, this.postController.commentpost);
    this.router.post("/subcomment/:id", checkAuth, this.postController.subcommentpost);
  }

  public getRouter(): Router {
    return this.router;
  }
}