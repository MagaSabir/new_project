import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwt.service";
import {container} from "../../composition-root";
import {AuthRepository} from "../../modules/auth/infrastructure/auth.repository";
const authRepository = container.get(AuthRepository)

export const refreshMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken
    if (!token) {
        res.sendStatus(401);
        return
    }

    try {
        const payload: any = await jwtService.verifyToken(token)

        const session = await authRepository.findSession(payload.userId, payload.deviceId)

        if(!session || session.lastActiveDate !== payload.iat?.toString()) {

            res.sendStatus(401)
            return
        }
        req.payload = payload
        next()
    } catch (e) {
        res.sendStatus(401)
    }
}