import { Router } from "express";
import { blogController } from "../controllers/blog.controller";
import {
  descriptionValidator,
  nameValidator,
  websiteUrlValidator,
} from "../validations/blogValidation/blog.validation";
import { authMiddleware } from "../core/middlewares/authMiddleware";
import {
  contentValidator,
  shortDescriptionValidator,
  titleValidation
} from "../validations/blogValidation/postValidation";

export const blogRouter = Router();

blogRouter
  .get("/:id", blogController.getBlog)
  .get("/", blogController.getAllBlogs)
  .post(
    "/",
    authMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    blogController.postController,
  )
  .post("/:id/posts", authMiddleware, titleValidation,
      shortDescriptionValidator,
      contentValidator, blogController.postControllerByBlogId)
  .get("/:id/posts", blogController.getPostsByBlogID)
  .put(
    "/:id",
    authMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    blogController.putController,
  )
  .delete("/:id", authMiddleware, blogController.deleteController);
