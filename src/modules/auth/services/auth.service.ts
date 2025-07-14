import {AuthRepository} from "../repositories/auth.repository";
import bcrypt from "bcrypt";
import {nodemailerService} from "../../../common/adapters/nodemailer.service";
import {add} from "date-fns";
import {ResultStatus} from "../../../common/types/resultStatuse";
import {WithId} from "mongodb";
import {PayloadType, TokensType} from "../../../common/types/types";

import {emailExamples} from "../../../common/adapters/html.message";
import {BcryptPasswordHash} from "../../../common/adapters/bcrypt.password";
import {jwtService} from "../../../common/adapters/jwt.service";
import {injectable} from "inversify";
import {CreatedUserType} from "../../../models/schemas/Auth.schema";
import {UsersRepository} from "../../users/infrasctructure/users.repository";
import {randomUUID} from "crypto";
import {QueryUsersRepository} from "../../users/infrasctructure/query.users.repository";
import {CreateUserDto} from "../../users/domain/user.dto";
import {UserDocument, UserModel} from "../../users/domain/user.entity";

@injectable()
export class AuthService {

    constructor(protected authRepository: AuthRepository,
                protected usersRepository: UsersRepository,
                protected queryRepository: QueryUsersRepository) {
    }

    async login(loginOrEmail: string, password: string, ip: string, userAgent: string): Promise<TokensType | null> {
        const user = await this.authRepository.findUser(loginOrEmail)
        if (!user) return null;
        const isValid: boolean = await BcryptPasswordHash.compare(password, user.password)
        if (!isValid) return null

        const deviceId = randomUUID();
        const [accessToken, refreshToken] = await Promise.all([
            jwtService.generateAccessToken(user._id.toString(), user.login),
            jwtService.generateRefreshToken(user._id.toString(), user.login, deviceId)
        ])

        const payload = await jwtService.verifyToken(refreshToken)

        await this.authRepository.addSession({
            userId: user._id.toString(),
            deviceId,
            userAgent,
            ip,
            lastActiveDate: payload.iat,
            expiration: payload.exp
        })
        return {accessToken, refreshToken};
    }

    async refreshTokenService(payload: any) {

        const accessToken: string = await jwtService.generateAccessToken(payload.userId, payload.userLogin);
        const newRefreshToken: string = await jwtService.generateRefreshToken(payload.userId, payload.userLogin, payload.deviceId);
        const payload2 = await jwtService.verifyToken(newRefreshToken)

        await this.authRepository.updateSession(payload2.userId, payload2.deviceId, payload2.iat, payload2.exp)
        return {accessToken, refreshToken: newRefreshToken};
    }

    async logOutService(payload: PayloadType) {
        await this.authRepository.deleteSessions(payload.userId, payload.deviceId)
    }


    async createUserService(dto: CreateUserDto) {
        console.log('dt0 - ' + dto)
        const user = await this.queryRepository.findLoginOrEmail(dto.email, dto.login)
        if (user) {
            const isEmail: boolean = user.email === dto.email
            const isLogin: boolean = user.login === dto.login

            const errors = []

            if (isEmail) errors.push({message: 'Email already exists', field: 'email'})
            if (isLogin) errors.push({message: 'Login already exists', field: 'login'})

            return {
                status: ResultStatus.BadRequest,
                errorsMessages: errors
            }
        }

        const registerUser: UserDocument = await UserModel.registerUser(dto)
        await this.usersRepository.save(registerUser)

        try {
            nodemailerService.sendEmail(
                registerUser.email,
                registerUser.confirmationCode,
                emailExamples.registrationEmail
            )
        } catch (e) {
            console.error('error', e)
        }
        return {status: ResultStatus.Success}
    }

    async confirmationUserService(code: string) {
        const user: WithId<CreatedUserType> | null = await this.queryRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.isConfirmed) return false
        if (user.confirmationCodeExpiration! < new Date()) return false

        return await this.usersRepository.updateConfirmation(user._id)
    }

    async passwordRecovery(email: string) {
        const user = await this.queryRepository.findUserByEmail(email)
        console.log(user)

        const code = randomUUID()
        const codeExpiration = add(new Date(), {
            hours: 1,
            minutes: 30,
        }).toISOString()

        const result = await this.usersRepository.updateResendConfirmation(email, code, codeExpiration)
        if (result) {
            nodemailerService.sendEmail(
                email, code, emailExamples.passwordRecoveryEmail
            )
        }
        return result
    }


    async newLogin(password: string, code: string) {
        try {
            const user: WithId<CreatedUserType> | null = await this.queryRepository.findUserByConfirmationCode(code)
            if (!user) return null
            if (user.isConfirmed) return null
            if (user.confirmationCodeExpiration! < new Date()) return null
            const passwordHash: string = await bcrypt.hash(password, 10)

            const result = await this.usersRepository.updatePassword(user._id, passwordHash)
            if (!result) return null
        } catch (e) {
            console.error(e)
        }
    }

    async resendConfirmCodeService(email: string) {
        const user: WithId<CreatedUserType> | null = await this.queryRepository.findUserByEmail(email)
        if (!user) return {status: ResultStatus.BadRequest}

        if (user.isConfirmed) {
            return {
                status: ResultStatus.BadRequest
            }
        }

        const newCode = randomUUID()
        const newExpiration: string = add(new Date(), {
            hours: 1,
            minutes: 30,
        }).toISOString()

        const result: boolean = await this.usersRepository.updateResendConfirmation(email, newCode, newExpiration)
        if (result) {
            nodemailerService.sendEmail(email, newCode, emailExamples.registrationEmail)
            return {
                status: ResultStatus.NotContent
            }

        } else {
            return {status: ResultStatus.NotFound}
        }
    }
}



