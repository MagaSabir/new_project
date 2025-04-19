import {authService} from "../domain/auth.service";
import {Request, Response} from "express";

export const authController = {
    getAuth: async (req: Request, res: Response) => {
        const isLogged = await authService.auth(req.body)
        res.status(204).send(isLogged)
    }
}