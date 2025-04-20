import {userService} from "../domain/users.service";
import {Request, Response} from "express";
import {STATUS_CODE} from "../core/http-statuses-code";
import {PostType} from "../types/postTypse/postType";
import {ErrorMessageType} from "../types/blogTypes/blogType";
import {errorsArray} from "../core/utils/errorMessage";


export const usersController = {
    postController: async (req: Request, res: Response) => {
        const errors: ErrorMessageType[] = errorsArray(req)
        if(errors.length) {
            res.status(STATUS_CODE.BAD_REQUEST_400).send({errorsMessages: errors})
        }
        const user = await userService.createUserService(req.body)
        if(!user) {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "string",
                        field: "loginOrEmail"
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
        const searchLoginTerm = req.query.searchLoginTerm
        const searchEmailTerm = req.query.searchEmailTerm

        const items: {pagesCount: number,
            page: number,
            pageSize: number,
            totalCount:number,
            items: PostType[]} = await userService.getUsers(pageNumber,pageSize,sortDirection, sortBy, searchLoginTerm, searchEmailTerm)

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