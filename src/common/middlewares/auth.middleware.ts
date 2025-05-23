import {NextFunction, Response, Request} from "express";
import {jwtService} from "../adapters/jwt.service";

export const accessTokenMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.sendStatus(401);
        return
    }
    const [authType, token] = authHeader.split(' ');
    if (authType !== 'Bearer' || !token) {
        res.sendStatus(401);
        return
    }
    // const token = req.cookies.refreshToken
    try {
        const payload = await jwtService.verifyToken(token)
        if (payload) {
            const {userId, userLogin} = payload
            req.user = {id: userId, login: userLogin}
            next()
            return
        }
    } catch (e) {
        res.sendStatus(401)
        return
    }
}