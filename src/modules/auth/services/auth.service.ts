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


export type PayloadType ={
    userId: string;
    userLogin: string;
    tokenId: string
}
export const tokenBlacklist = new Set()
export const authService = {
    async auth(loginOrEmail: string, password: string) {
        const user = await authRepository.findUser(loginOrEmail)
        if (!user) return false;

        const isValid: boolean = await bcrypt.compare(password, user.password)
        if (!isValid) return false

        const tokenId = randomUUID();
        const accessToken: string = await jwtService.generateToken(user._id.toString(), user.login)
        const newRefreshToken = await jwtService.generateRefreshToken((user._id.toString()), user.login, tokenId)
        return {accessToken, newRefreshToken};
    },


    async createUserService(login: string, password: string, email: string) {
        const user = await usersRepository.findLoginOrEmail(email, login)
        if (user) {
            const isEmail = user.email === email
            const isLogin = user.login === login

            const errors = []

            if (isLogin) errors.push({message: 'Email already exists', field: 'email'})
            if (isEmail) errors.push({message: 'Login already exists', field: 'login'})

            return {
                status: ResultStatus.BadRequest,
                errorsMessages: errors
            }
        }

        const passwordHash = await bcrypt.hash(password, 10)
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
            await nodemailerService.sendEmail(
                newUser.email,
                newUser.confirmationCode
            )
        } catch (e) {
            console.error('error', e)
        }
        return {status: ResultStatus.Success}
    },

    async confirmationUserService(code: string) {
        const user: WithId<CreatedUserType> | null = await usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.isConfirmed) return false
        if (user.confirmationCodeExpiration! < new Date()) return false

        return await usersRepository.updateConfirmation(user._id)
    },

    async resendConfirmCodeService(email: string) {
        const user = await usersRepository.findUserByEmail(email)
        if (!user) return {status: ResultStatus.BadRequest}

        if (user.isConfirmed) {
            return {
                status: ResultStatus.BadRequest
            }
        }

        const newCode = randomUUID()
        const newExpiration = add(new Date(), {
            hours: 1,
            minutes: 30,
        }).toISOString()

        const result = await usersRepository.updateResendConfirmation(email, newCode, newExpiration)
        if (result) {
            await nodemailerService.sendEmail(email, newCode)
            return {
                status: ResultStatus.NotContent
            }

        } else {
            return {status: ResultStatus.NotFound}
        }
    },

    async refreshTokenService(payload : PayloadType) {

            await authRepository.addTokenInBlacklist(payload.tokenId)

            const newTokenId = randomUUID();
            const accessToken = await jwtService.generateToken(payload.userId, payload.userLogin);
            const newRefreshToken = await jwtService.generateRefreshToken(payload.userId, payload.userLogin, newTokenId);

            return {accessToken, refreshToken: newRefreshToken};
    },

    async logOutService(payload: PayloadType) {
            await authRepository.addTokenInBlacklist(payload.tokenId)
    }
}


