import {client} from "../../../db/mongoDb";

export const authRepository = {
    async findUser(body: any) {
        return  await client.db('blogPlatform').collection('users')
            .findOne({$or: [{login: body}, {email: body}]})
    }
}