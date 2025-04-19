import {usersRepository} from "../repositories/users.repository";
import bcrypt from 'bcrypt';
import {body} from "express-validator";

import {postRepository} from "../repositories/post.repository";
import {an} from "@faker-js/faker/dist/airline-BUL6NtOJ";

export const userService = {
    async createUserService  (bodyReq: any)  {
        const userEmail = await usersRepository.fundOne(bodyReq.email)
        if(userEmail) {
            return false
        }
        const hash = await bcrypt.hash(bodyReq.password, 10)
        const user = {
            login: bodyReq.login,
            password: hash,
            email: bodyReq.email,
            createdAt: new Date().toISOString()
        }
        const newUser = await usersRepository.createUser(user)
        return {
            id: newUser.insertedId,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },

    async getUsers (pageNumber:number, pageSize:number, sortDirection: any, sortBy: any, searchNameTerm: any): Promise<any> {
        const { users, totalCountUsers } = await usersRepository.getUser(
            pageNumber,
            pageSize,
            sortDirection,
            sortBy,
            searchNameTerm
        )

        const newUser = users.map(el => {
            return {
                id: el._id.toString(),
                login: el.login,
                email: el.email,
                createdAt: el.createdAt

            }
        })
        return {
            pagesCount: Math.ceil(totalCountUsers/ pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountUsers,
            items: newUser
        }
    },

    async deleteUserByID (id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    }
}