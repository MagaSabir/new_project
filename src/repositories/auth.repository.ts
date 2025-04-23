import {client} from "../db/mongoDb";

export const authRepository = {
    async auth(body: any) {
        const user = await client.db('blogPlatform').collection('users')
            .findOne({$or: [{login: body}, {email: body}]})

        return user
    }
}