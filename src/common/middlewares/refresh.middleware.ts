import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwt.service";
import {authRepository} from "../../modules/auth/repositories/auth.repository";
import {PayloadType} from "../../modules/auth/services/auth.service";


export const refreshMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken
    if (!token) return res.sendStatus(401);

    try {
        const payload: PayloadType = await jwtService.verifyToken(token)
        const isBlacklisted = await authRepository.findTokenInBlacklist(payload.tokenId)
        if(isBlacklisted) return res.sendStatus(401)
        req.payload = payload
        next()
    } catch (e) {
        res.sendStatus(401)
    }
}