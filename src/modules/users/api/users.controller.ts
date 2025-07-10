import {Request, Response} from "express";
import {STATUS_CODE} from "../../../common/adapters/http-statuses-code";
import {UserViewModel} from "../../../models/view_models/UserViewModel";
import {PaginationType} from "../../../common/types/types";
import {sortQueryFields} from "../../../common/types/sortQueryFields";
import {CreatedUserType} from "../../../models/schemas/Auth.schema";
import {injectable} from "inversify";
import {QueryUsersRepository} from "../infrasctructure/query.users.repository";
import {UserService} from "../application/users.service";

@injectable()
export class UsersController {
    constructor(protected userService: UserService,
                protected queryUsersRepository: QueryUsersRepository) {
    }

    async createUserController(req: Request, res: Response): Promise<void> {
        const userId: string | null = await this.userService.createUserService(req.body)

        if (!userId) {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "already exists",
                        field: "loginOrEmail"
                    }
                ]
            })
            return
        }
        const createdUser: UserViewModel | null = await this.queryUsersRepository.getCreatedUser(userId)
        res.status(201).send(createdUser)
    }

    async getUserController(req: Request, res: Response): Promise<void> {
        const searchLoginTerm = req.query.searchLoginTerm
        const searchEmailTerm = req.query.searchEmailTerm
        const {pageNumber, pageSize, sortDirection, sortBy} = sortQueryFields(req.query)
        const user: PaginationType<CreatedUserType> = await this.queryUsersRepository.getUser(pageNumber, pageSize, sortDirection, sortBy, searchLoginTerm, searchEmailTerm)
        res.status(STATUS_CODE.OK_200).send(user)
    }

    async deleteUserController(req: Request, res: Response): Promise<void> {
        const result: boolean = await this.userService.deleteUserByID(req.params.id)
        if (!result) {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }
}