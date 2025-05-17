import {authService} from "../services/auth.service";
import {Request, Response} from "express";
import {jwtService} from "../../../common/adapters/jwt.service";
import {queryUsersRepository} from "../../users/queryRepository/query.users.repository";
import {ResultStatus} from "../../../common/types/resultStatuse";
import {STATUS_CODE} from "../../../common/adapters/http-statuses-code";

export const authController = {
   async getAuth (req: Request, res: Response): Promise<void>  {
            const user = await authService.auth(req.body.loginOrEmail, req.body.password)
       console.log(user)
            if(!user) {
                res.sendStatus(401)
                return
            }

       const token: string = await jwtService.generateToken(user._id.toString(), user.login)
       const refresh = await jwtService.generateRefreshToken((user._id.toString()), user.login)

       // res.status(200).json({accessToken: token})
       res
           .cookie('refreshToken', refresh, { httpOnly: true, secure: true })
           .header('Authorization', token)
           .json({accessToken: token});
    },

    getUser: async (req: Request, res: Response): Promise<void> => {
        const user = await queryUsersRepository.getUseById(req.user.id)
       res.status(200).send(user)
    },

    async userRegistration (req: Request,res: Response) {
        const {login, email, password } = req.body

        const result = await authService.createUserService(login, password, email)

        if (result.status === ResultStatus.BadRequest) {
            res.status(STATUS_CODE.BAD_REQUEST_400).json({ errorsMessages: result.errorsMessages })
        }

        if (result.status === ResultStatus.Success) {
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        }
    },

    async userConfirmation (req: Request, res: Response) {
       const { code } = req.body
       const user = await authService.confirmationUserService(code)
        if(user) {
            res.sendStatus(204)
            return
        }
        res.status(400).json({
            errorsMessages: [{ message: 'User not found', field: 'code' }],
        });
    },

    async resendConfirm (req: Request, res: Response) {
       const { email } = req.body
        const result = await authService.resendConfirmCodeService(email)
        if(result.status === ResultStatus.NotContent) {
            res.sendStatus(204)
            return
        }
        if(result.status === ResultStatus.BadRequest) {
            res.status(400).json({
                errorsMessages: [{ message: 'User not found', field: 'email' }],
            });
        }
    }
}