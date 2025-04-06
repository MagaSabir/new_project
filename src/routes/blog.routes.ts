import {Router} from "express";
import {SETTINGS} from "../settings";
import {blogController} from "../controllers/blog.controller";
import {descriptionValidator, nameValidator, websiteUrlValidator} from "../validations/blogValidation/blog.validation";

export const blogRouter = Router()

blogRouter
    .get(SETTINGS.PATH.blogs,  blogController.getAllBlogs)
    .post(SETTINGS.PATH.blogs, nameValidator, descriptionValidator, websiteUrlValidator, blogController.postController)

