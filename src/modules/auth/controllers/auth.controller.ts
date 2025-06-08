import {authService} from "../services/auth.service";
import {Request, Response} from "express";
import {queryUsersRepository} from "../../users/queryRepository/query.users.repository";
import {ResultStatus} from "../../../common/types/resultStatuse";
import {STATUS_CODE} from "../../../common/adapters/http-statuses-code";


export const authController = {
    async login(req: Request, res: Response) {

        const ip = req.ip ? req.ip : ''
        const userAgent = req.headers['user-agent'] ? req.headers['user-agent']: ''
        const tokens = await authService.auth(req.body.loginOrEmail, req.body.password, ip, userAgent)
        if (!tokens) {
            res.sendStatus(401);
            return
        }
        res
            .cookie('refreshToken', tokens.newRefreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send({accessToken: tokens.accessToken});

    },

    async refreshToken(req: Request, res: Response) {
        const tokens = await authService.refreshTokenService(req.payload);
        if(tokens)

        res
            .cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send({accessToken: tokens.accessToken});
    },

    async logOut(req: Request, res: Response) {
        await authService.logOutService(req.payload)
        res.clearCookie('refreshToken').sendStatus(204)
    },


    getUser: async (req: Request, res: Response): Promise<void> => {
        const user = await queryUsersRepository.getUseById(req.user.id)
        res.status(200).send(user)
    },

    async userRegistration(req: Request, res: Response) {
        const {login, email, password} = req.body
        const result = await authService.createUserService(login, password, email)
        if (result.status === ResultStatus.BadRequest) {
            res.status(STATUS_CODE.BAD_REQUEST_400).json({errorsMessages: result.errorsMessages})
        }
        if (result.status === ResultStatus.Success) {
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        }
    },

    async recovery (req: Request, res: Response) {
      const email = req.body.email
        const result = await authService.recovery(email)
        if(result === null) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
        return
    },

    async newLogin(req: Request, res: Response) {
        const recoveryCode = req.body.recoveryCode
        const newPassword = req.body.newPassword
        const isConfirmed =  await authService.newLogin(recoveryCode, newPassword)
        res.sendStatus(204)
    },

    async userConfirmation(req: Request, res: Response) {
        const {code} = req.body
        const user = await authService.confirmationUserService(code)
        if (user) {
            res.sendStatus(204)
            return
        }
        res.status(400).json({
            errorsMessages: [{message: 'User not found', field: 'code'}],
        });
    },

    async resendConfirm(req: Request, res: Response) {
        const result = await authService.resendConfirmCodeService(req.body.email)
        if (result.status === ResultStatus.NotContent) {
            res.sendStatus(204)
            return
        }
        if (result.status === ResultStatus.BadRequest) {
            res.status(400).json({
                errorsMessages: [{message: 'User not found', field: 'email'}],
            });
        }
    },
}