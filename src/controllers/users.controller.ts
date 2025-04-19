import {userService} from "../domain/users.service";
import {Request, Response} from "express";
import {STATUS_CODE} from "../core/http-statuses-code";
import {PostType} from "../types/postTypse/postType";


export const usersController = {
    postController: async (req: Request, res: Response) => {
        const user = await userService.createUserService(req.body)
        if(!user) {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "string",
                        field: "email"
                    }
                ]})
        }

        res.status(201).send(user)
    },
    async getUserController(req: Request, res: Response) {
        const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10
        const sortDirection: 1 | -1 = req.query.sortDirection === 'asc' ? 1 : -1
        const sortBy = req.query.sortBy || 'createdAt'
        const searchNameTerm = req.query.searchNameTerm

        const items: {pagesCount: number,
            page: number,
            pageSize: number,
            totalCount:number,
            items: PostType[]} = await userService.getUsers(pageNumber,pageSize,sortDirection, sortBy, searchNameTerm)

        res.status(STATUS_CODE.OK_200).send(items)
    },

     deleteUserController: async (req: Request, res: Response) => {
        const result = await userService.deleteUserByID(req.params.id)
        console.log(result)
        if(!result) {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }
}