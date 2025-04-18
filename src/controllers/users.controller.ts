import {userService} from "../domain/users.service";
import {Request, Response} from "express";


export const usersController = {
    postController: async (req: Request, res: Response) => {
        const user = await userService.createUserService(req.body)

        res.status(200).send(user)
    },
    async getUser(req: Request, res: Response) {
        const user = await userService.getUsers()
        res.status(200).send(user)
    }
}