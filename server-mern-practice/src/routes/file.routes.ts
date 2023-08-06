import express from "express";
const fileRouter = express.Router();
import * as fileController from "../controllers/FileController.js";
import {checkAuth} from "../utils/checkAuth.js";

fileRouter.post("/uploadfile", checkAuth, fileController.uploadFile);

export { fileRouter };
