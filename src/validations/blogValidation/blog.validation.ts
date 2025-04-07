import { body } from "express-validator";

export const nameValidator = body("name")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 15 });
export const descriptionValidator = body("description")
  .isString()
  .withMessage("no string")
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("length");
export const websiteUrlValidator = body("websiteUrl")
  .isString()
  .withMessage("no string")
  .trim()
  .isLength({ max: 500 })
  .isURL()
  .withMessage(" not url");
