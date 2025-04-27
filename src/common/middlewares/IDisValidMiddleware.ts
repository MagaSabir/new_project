import {param, ValidationChain} from "express-validator";

export const IDisValid: ValidationChain = param('id').isMongoId().withMessage('not valid id')