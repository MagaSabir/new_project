import {AuthService} from "../services/auth.service";
import {Request, Response} from "express";
import {ResultStatus} from "../../../common/types/resultStatuse";
import {STATUS_CODE} from "../../../common/adapters/http-statuses-code";
import {TokensType} from "../../../common/types/types";
import {injectable} from "inversify";
import {QueryUsersRepository} from "../../users/infrasctructure/query.users.repository";

@injectable()
export class AuthController {

    constructor(protected authService: AuthService,
                protected queryUsersRepository: QueryUsersRepository) {}

    async login(req: Request, res: Response) {
        const ip: string = req.ip ? req.ip : ''
        const userAgent: string = req.headers['user-agent'] ? req.headers['user-agent'] : ''

        const tokens: TokensType | null = await this.authService.login(req.body.loginOrEmail, req.body.password, ip, userAgent)
        if (!tokens) {
            res.sendStatus(401);
            return
        }
        res
            .cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send({accessToken: tokens.accessToken});

    }

    async refreshToken(req: Request, res: Response) {
        const tokens: TokensType = await this.authService.refreshTokenService(req.payload);
        if (tokens)
            res
                .cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
                .status(200)
                .send({accessToken: tokens.accessToken});
    }

    async logOut(req: Request, res: Response) {
        await this.authService.logOutService(req.payload)
        res.clearCookie('refreshToken').sendStatus(204)
    }


    async getUser(req: Request, res: Response): Promise<void> {
        const user = await this.queryUsersRepository.getUserById(req.user.id)
        res.status(200).send(user)
    }

    async userRegistration(req: Request, res: Response) {
        const result = await this.authService.createUserService(req.body)
        if (result.status === ResultStatus.BadRequest) {
            res.status(STATUS_CODE.BAD_REQUEST_400).json({errorsMessages: result.errorsMessages})
        }
        if (result.status === ResultStatus.Success) {
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        }
    }


    async userConfirmation(req: Request, res: Response) {
        const {code} = req.body
        const user = await this.authService.confirmationUserService(code)
        if (user) {
            res.sendStatus(204)
            return
        }
        res.status(400).json({
            errorsMessages: [{message: 'User not found', field: 'code'}],
        });
    }

    async resendConfirm(req: Request, res: Response) {
        const result = await this.authService.resendConfirmCodeService(req.body.email)
        if (result.status === ResultStatus.NotContent) {
            res.sendStatus(204)
            return
        }
        if (result.status === ResultStatus.BadRequest) {
            res.status(400).json({
                errorsMessages: [{message: 'User not found', field: 'email'}],
            });
        }
    }

    async passwordRecovery (req: Request, res: Response) {
        await this.authService.passwordRecovery(req.body.email)
            res.sendStatus(204)
            return

    }

    async newPassword (req: Request, res: Response) {
        const recoveryCode = req.body.recoveryCode
        const password = req.body.newPassword
        const result = await this.authService.newLogin(password, recoveryCode)

        if (result === null) {
            res.status(400).json({
                errorsMessages: [{message: 'recoveryCode', field: 'recoveryCode'}],
            });
        }

        res.sendStatus(204)

    }
}
