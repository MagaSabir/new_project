import { Router } from "express";
import { postsController } from "./controllers/posts.controller";
import {
  blogIdValidator,
  contentValidator,
  shortDescriptionValidator,
  titleValidation,
} from "../../common/middlewares/blogValidation/posts.validations";
import { authMiddleware } from "../../common/middlewares/authMiddleware";

export const postRouter = Router();

postRouter
  .get("/", postsController.getAllPosts)
  .get("/:id", postsController.getPost)
  .put(
    "/:id",
    authMiddleware,
    titleValidation,
    shortDescriptionValidator,
    contentValidator,
    postsController.putController,
  )
  .delete("/:id", authMiddleware, postsController.deleteController)
  .post(
    "/",
    authMiddleware,
    blogIdValidator,
    titleValidation,
    shortDescriptionValidator,
    contentValidator,
    postsController.postController,
  );
