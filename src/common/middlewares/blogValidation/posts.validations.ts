import {body, ValidationChain} from "express-validator";
import {QueryBlogsRepository} from "../../../modules/blogs/infrasctructure/query.blog.repository";
const queryBlogRepository = new QueryBlogsRepository()
export const titleValidation: ValidationChain = body("title")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("length");
export const shortDescriptionValidator: ValidationChain = body("shortDescription")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("length");
export const contentValidator: ValidationChain = body("content")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("length");
export const blogIdValidator: ValidationChain = body("blogId")
  .trim().isMongoId()
  .custom(async (blogId: string): Promise<boolean> => {
    return await queryBlogRepository.getBlog(blogId) ? true : false;
  })
  .withMessage("no blogId");





