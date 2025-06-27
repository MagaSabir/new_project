import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwt.service";

export const checkAccess  = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;

    if(!auth) {
        next()
        return
    }

    const token: string = auth.split(' ')[1];
    try {
        const payload = await jwtService.verifyToken(token)

        const {userId, userLogin} = payload
        req.user = {id: userId, login: userLogin}

        next()
        return
    } catch (e) {
        console.error(e)
        return
    }
}