import {authService} from "../services/auth.service";
import {Request, Response} from "express";
import {ErrorMessageType} from "../../../common/types/blogTypes/blogType";
import {errorsArray} from "../../../common/utils/errorMessage";
import {STATUS_CODE} from "../../../common/utils/http-statuses-code";
import {jwtService} from "../../../common/jwt.service";
import {usersRepository} from "../../users/repositories/users.repository";
import {queryUsersRepository} from "../../users/queryRepository/query.users.repository";

export const authController = {
   async getAuth (req: Request, res: Response)  {
        const errors: ErrorMessageType[] = errorsArray(req);
        if (errors.length) {
            res.status(STATUS_CODE.BAD_REQUEST_400).send({ errorsMessages: errors });
            return;
        }
            const user = await authService.auth(req.body.loginOrEmail, req.body.password)
            if(!user) {
                res.sendStatus(401)
                return
            }
            const token: string = await jwtService.generateToken(user._id.toString(), user.login)

        res.status(200).json({accessToken: token})
    },

    getUser: async (req: Request, res: Response) => {
        // @ts-ignore
        const user = await queryUsersRepository.getUseById(req.user.id)
       res.status(200).send(user)
    },
}