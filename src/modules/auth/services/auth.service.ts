import {authRepository} from "../repositories/auth.repository";
import bcrypt from "bcrypt";

export const authService = {
    async auth (loginOrEmail: string, password: string) {
        const user = await authRepository.auth(loginOrEmail)
        if (!user) return false;

        const isValid: boolean = await bcrypt.compare(password, user.password)
        if (!isValid) return false

        return user
    }
}