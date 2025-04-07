import { body } from "express-validator";
import { blogRepository } from "../../repositories/blog.repository";

export const titleValidation = body("title")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("length");
export const shortDescriptionValidator = body("shortDescription")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("length");
export const contentValidator = body("content")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("length");
export const blogIdValidator = body("blogId")
  .trim()
  .custom((blogId) => {
    return blogRepository.findBlog(blogId) ? true : false;
  })
  .withMessage("no blogId");
