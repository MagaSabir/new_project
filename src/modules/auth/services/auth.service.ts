import {authRepository} from "../repositories/auth.repository";
import bcrypt from "bcrypt";

export const authService = {
    async auth (loginOrEmail: string, password: string) {
        const user = await authRepository.auth(loginOrEmail)
        if(!user) return false
        return  await bcrypt.compare(password, user.password)
    }
}