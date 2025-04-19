import {client} from "../db/mongoDb";

export const authRepository = {
    async auth(body: any) {
        const {email, login} = body
        const loginOrEmail = await client.db('blogPlatform').collection('users')
            .find({$or: [{login: login}, {email: email}]}).toArray()
        return loginOrEmail
    }
}