import {Router} from "express";
import {blogsController} from "./controllers/blog.controller";
import {
    descriptionValidator,
    nameValidator,
    websiteUrlValidator,
} from "../../common/middlewares/blogValidation/blogs.validations";
import {basicAuthMiddleware} from "../../common/middlewares/basic.auth.middleware";
import {
    contentValidator,
    shortDescriptionValidator,
    titleValidation
} from "../../common/middlewares/blogValidation/posts.validations";
import {IDisValid} from "../../common/middlewares/IDisValidMiddleware";
import {inputValidationErrors} from "../../common/adapters/errorMessage";

export const blogRouter = Router();

blogRouter
    .get("/:id", blogsController.getBlog)
    .get("/", blogsController.getBlogs)
    .post("/", basicAuthMiddleware, nameValidator, descriptionValidator, websiteUrlValidator, inputValidationErrors,
        blogsController.createBlog
    )

    .post("/:id/posts", IDisValid, basicAuthMiddleware, titleValidation, shortDescriptionValidator, contentValidator, inputValidationErrors,
        blogsController.createPostByBlogId
    )

    .get("/:id/posts", IDisValid, inputValidationErrors, blogsController.getPostsByBlogId)

    .put("/:id", IDisValid, basicAuthMiddleware, nameValidator, descriptionValidator, websiteUrlValidator, inputValidationErrors,
        blogsController.updateBlog,
    )

    .delete("/:id", IDisValid, basicAuthMiddleware, inputValidationErrors, blogsController.deleteBlog);
