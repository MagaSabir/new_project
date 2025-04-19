import {authRepository} from "../repositories/auth.repository";

export const authService = {
    async auth (body:any) {
        return authRepository.auth(body)
    }
}