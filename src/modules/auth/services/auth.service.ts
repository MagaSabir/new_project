import {authRepository} from "../repositories/auth.repository";
import bcrypt from "bcrypt";
import {nodemailerService} from "../../../common/adapters/nodemailer.service";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";
import {usersRepository} from "../../users/repositories/users.repository";
import {ResultStatus} from "../../../common/types/resultStatuse";
import {WithId} from "mongodb";
import {CreatedUserType} from "../../../common/types/userType/userType";

export const authService = {
    async auth(loginOrEmail: string, password: string) {
        const user = await authRepository.findUser(loginOrEmail)
        console.log(user)
        if (!user) return false;

        const isValid: boolean = await bcrypt.compare(password, user.password)
        if (!isValid) return false

        return user
    },



    async createUserService(login: string, password: string, email: string) {
        const user = await usersRepository.findLoginOrEmail(email, login)
        if(user) {
            return {
                status: ResultStatus.BadRequest
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
        if (user.confirmationCodeExpiration! < new Date().toISOString()) return false

        return  await usersRepository.updateConfirmation(user._id)
    },

    async resendConfirmCodeService(email: string){
        const user = await usersRepository.findUserByEmail(email)
        if(!user) return {status: ResultStatus.BadRequest}

        if(user.isConfirmed) {
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
        if(result) {
            await nodemailerService.sendEmail(email, newCode)
            return {
                status: ResultStatus.NotContent
            }
        } else {
            return { status: ResultStatus.NotFound}
        }
    }
}
