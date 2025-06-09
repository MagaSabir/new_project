import {authRepository} from "../repositories/auth.repository";
import bcrypt from "bcrypt";
import {nodemailerService} from "../../../common/adapters/nodemailer.service";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";
import {usersRepository} from "../../users/repositories/users.repository";
import {ResultStatus} from "../../../common/types/resultStatuse";
import {WithId} from "mongodb";
import {CreatedUserType} from "../../../common/types/userType/userType";
import {jwtService} from "../../../common/adapters/jwt.service";
import {PayloadType} from "../../../common/types/types";


 class AuthService  {
    async auth(loginOrEmail: string, password: string, ip: string, userAgent: string) {
        const user = await authRepository.findUser(loginOrEmail)
        if (!user) return false;

        const isValid: boolean = await bcrypt.compare(password, user.password)
        if (!isValid) return false

        const deviceId = randomUUID();
        const accessToken: string = await jwtService.generateToken(user._id.toString(), user.login)
        const newRefreshToken: string = await jwtService.generateRefreshToken((user._id.toString()), user.login, deviceId)
        const payload = await  jwtService.verifyToken(newRefreshToken)

        await authRepository.addSession({
            userId: user._id.toString(),
            deviceId,
            userAgent,
            ip,
            lastActiveDate: payload.iat,
            expiration: payload.exp
        })
        return {accessToken, newRefreshToken};
    }

    async refreshTokenService(payload: any) {

        const accessToken: string = await jwtService.generateToken(payload.userId, payload.userLogin);
        const newRefreshToken: string = await jwtService.generateRefreshToken(payload.userId, payload.userLogin, payload.deviceId);
        const payload2 = await  jwtService.verifyToken(newRefreshToken)

        await authRepository.updateSession(payload2.userId, payload2.deviceId, payload2.iat, payload2.exp)
        return {accessToken, refreshToken: newRefreshToken};
    }

    async logOutService(payload: PayloadType) {
        await authRepository.deleteSessions(payload.userId, payload.deviceId)
    }


    async createUserService(login: string, password: string, email: string) {
        const user = await usersRepository.findLoginOrEmail(email, login)
        if (user) {
            const isEmail: boolean = user.email === email
            const isLogin : boolean= user.login === login

            const errors = []

            if (isEmail) errors.push({message: 'Email already exists', field: 'email'})
            if (isLogin) errors.push({message: 'Login already exists', field: 'login'})

            return {
                status: ResultStatus.BadRequest,
                errorsMessages: errors
            }
        }

        const passwordHash: string = await bcrypt.hash(password, 10)
        const newUser = {
            login,
            password: passwordHash,
            email,
            isConfirmed: false,
            confirmationCode: randomUUID(),
            confirmationCodeExpiration: add(new Date(), {
                hours: 1,
                minutes: 30,
            }),
        };
        await usersRepository.createUser(newUser)

        try {
             nodemailerService.sendEmail(
                newUser.email,
                newUser.confirmationCode
            )
        } catch (e) {
            console.error('error', e)
        }
        return {status: ResultStatus.Success}
    }

    async confirmationUserService(code: string) {
        const user: WithId<CreatedUserType> | null = await usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.isConfirmed) return false
        if (user.confirmationCodeExpiration! < new Date()) return false

        return await usersRepository.updateConfirmation(user._id)
    }

    async recovery (email: string) {
        const user = await usersRepository.findUserByEmail(email)
        console.log(user)
        if(!user) return null

        const newCode = randomUUID()
        const newExperation = add(new Date(), {
            hours: 1,
            minutes: 30,
        }).toISOString()

        const result = await usersRepository.updateResendConfirmation(email, newCode, newExperation)
        if (result) {
            nodemailerService.sendEmail(email, newCode)
        }
    }


    async newLogin(code: string, password: string) {
        try {
            const user: WithId<CreatedUserType> | null = await usersRepository.findUserByConfirmationCode(code)
            if (!user) return false
            if (user.isConfirmed) return false
            if (user.confirmationCodeExpiration! < new Date()) return false
            const passwordHash: string = await bcrypt.hash(password, 10)

            return await usersRepository.updateConfirmation(user._id)
        } catch (e) {
            console.error(e)
        }
    }

    async resendConfirmCodeService(email: string) {
        const user: WithId<CreatedUserType > | null = await usersRepository.findUserByEmail(email)
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

        const result: boolean = await usersRepository.updateResendConfirmation(email, newCode, newExpiration)
        if (result) {
             nodemailerService.sendEmail(email, newCode)
            return {
                status: ResultStatus.NotContent
            }

        } else {
            return {status: ResultStatus.NotFound}
        }
    }
}

export const authService = new AuthService()


