import {NextFunction, Response, Request} from "express";
import {jwtService} from "../jwt.service";

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
    const payload = await jwtService.verifyToken(token)
    if(payload) {
        console.log(payload)
        // @ts-ignore
        req.user = { id: payload.userId, login: payload.userLogin}
        next()
        return
    }
    res.sendStatus(401)
    return
}