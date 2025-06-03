import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwt.service";
import {authRepository} from "../../modules/auth/repositories/auth.repository";


export const refreshMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken
    if (!token) {
        res.sendStatus(401);
        return
    }

    try {
        const payload = await jwtService.verifyToken(token)

        const session = await authRepository.findSession(payload.userId, payload.deviceId)

        if(!session || session.lastActiveDate !== payload.iat) {
            res.sendStatus(401)
            return
        }
        req.payload = payload
        next()
    } catch (e) {
        res.sendStatus(401)
    }
}