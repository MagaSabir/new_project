import {FieldValidationError, validationResult} from "express-validator";
import {Request} from "express";

export const errorsArray = (req: Request) => {
// @ts-ignore
    return validationResult(req).formatWith((errors: FieldValidationError) => ({
        message: errors.msg,
        field: errors.path
     })
    ).array({onlyFirstError: true})
}

