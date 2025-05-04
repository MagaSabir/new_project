import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const inputValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith((error: any) => ({
        message: error.msg,
        field: error.path,
    }));

    if (!errors.isEmpty()) {
        res.status(400).json({ errorsMessages: errors.array({ onlyFirstError: true }) });
        return
    }
    next();
    return;
};
