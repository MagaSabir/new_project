import {Router} from "express";
import {blogController} from "./controllers/blog.controller";
import {
  descriptionValidator,
  nameValidator,
  websiteUrlValidator,
} from "../../common/middlewares/blogValidation/blogs.validations";
import {authMiddleware} from "../../common/middlewares/authMiddleware";
import {
  contentValidator,
  shortDescriptionValidator,
  titleValidation
} from "../../common/middlewares/blogValidation/posts.validations";
import {IDisValid} from "../../common/middlewares/IDisValidMiddleware";
import {inputValidation, inputValidationErrors} from "../../common/utils/errorMessage";

export const blogRouter = Router();

blogRouter
  .get("/:id", IDisValid, blogController.getBlog)
  .get("/", blogController.getAllBlogs)
  .post(
    "/",
    authMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,inputValidationErrors,
    blogController.postController,
  )
  .post("/:id/posts",   IDisValid, authMiddleware, titleValidation,
      shortDescriptionValidator,
      contentValidator,inputValidationErrors, blogController.postControllerByBlogId)
  .get("/:id/posts", IDisValid, blogController.getPostsByBlogID)
  .put(
    "/:id",
      IDisValid,
    authMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    blogController.putController,
  )
  .delete("/:id", IDisValid, authMiddleware, blogController.deleteController);
