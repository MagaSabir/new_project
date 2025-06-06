import {userService} from "../services/users.service";
import {Request, Response} from "express";
import {STATUS_CODE} from "../../../common/adapters/http-statuses-code";
import {queryUsersRepository} from "../queryRepository/query.users.repository";
import {UserViewModel} from "../../../models/UserViewModel";
import {PaginationType} from "../../../common/types/types";
import {CreatedUserType} from "../../../common/types/userType/userType";
import {sortQueryFields} from "../../../common/types/sortQueryFields";


export const usersController = {
    postController: async (req: Request, res: Response):Promise<void> => {
        const userId: string | null = await userService.createUserService(req.body)

        if(!userId) {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "already exists",
                        field: "loginOrEmail"
                    }
                ]})
            return
        }
        const createdUser: UserViewModel | null = await queryUsersRepository.getCreatedUser(userId)
            res.status(201).send(createdUser)
    },

    async getUserController(req: Request, res: Response): Promise<void> {
        const searchLoginTerm = req.query.searchLoginTerm
        const searchEmailTerm = req.query.searchEmailTerm
        const { pageNumber, pageSize, sortDirection, sortBy} = sortQueryFields(req.params)
        const user: PaginationType<CreatedUserType> = await queryUsersRepository.getUser(pageNumber,pageSize,sortDirection, sortBy, searchLoginTerm, searchEmailTerm)
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