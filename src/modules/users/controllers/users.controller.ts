import {userService} from "../services/users.service";
import {Request, Response} from "express";
import {STATUS_CODE} from "../../../common/utils/http-statuses-code";
import {PostType} from "../../../common/types/postTypse/postType";
import {ErrorMessageType} from "../../../common/types/blogTypes/blogType";
import {errorsArray} from "../../../common/utils/errorMessage";
import {queryPostRepository} from "../../posts/queryRepository/query.post.repository";
import {queryUsersRepository} from "../queryRepository/query.users.repository";


export const usersController = {
    postController: async (req: Request, res: Response):Promise<void> => {
        const errors: ErrorMessageType[] = errorsArray(req)
        if(errors.length) {
            res.status(STATUS_CODE.BAD_REQUEST_400).send({errorsMessages: errors})
        }
        const userId = await userService.createUserService(req.body)

        if(!userId) {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "string",
                        field: "loginOrEmail"
                    }
                ]})
            return
        }
        const createdUser = await queryUsersRepository.getCreatedUser(userId)
            res.status(201).send(createdUser)
    },

    async getUserController(req: Request, res: Response): Promise<void> {
        const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10
        const sortDirection: 1 | -1 = req.query.sortDirection === 'asc' ? 1 : -1
        const sortBy = req.query.sortBy || 'createdAt'
        const searchLoginTerm = req.query.searchLoginTerm
        const searchEmailTerm = req.query.searchEmailTerm

        const user = await queryUsersRepository.getUser(pageNumber,pageSize,sortDirection, sortBy as string, searchLoginTerm, searchEmailTerm)
        res.status(STATUS_CODE.OK_200).send(user)
    },

     deleteUserController: async (req: Request, res: Response): Promise<void> => {
        const result: boolean = await userService.deleteUserByID(req.params.id)
        if(!result) {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }
}