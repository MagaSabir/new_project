import {body} from "express-validator";

export const contentValidation = body('content').trim().isLength({min: 20, max: 300}).withMessage('length')

export const likeStatusValidation = body('likeStatus').isIn(['Like', 'Dislike', 'None'])