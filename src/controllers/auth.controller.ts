import {authService} from "../domain/auth.service";
import {Request, Response} from "express";
import {ErrorMessageType} from "../types/blogTypes/blogType";
import {errorsArray} from "../core/utils/errorMessage";
import {STATUS_CODE} from "../core/http-statuses-code";

export const authController = {
    getAuth: async (req: Request, res: Response) => {
        const errors: ErrorMessageType[] = errorsArray(req);
        if (errors.length) {
            res.status(STATUS_CODE.BAD_REQUEST_400).send({ errorsMessages: errors });
            return;
        }
            const isLogged = await authService.auth(req.body.loginOrEmail, req.body.password)
            if(!isLogged) {
                res.sendStatus(401)
                return
            }
            res.sendStatus(204)
    }
}