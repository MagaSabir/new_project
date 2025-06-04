import {client} from "../../../db/mongoDb";
import {ObjectId} from "mongodb";

export const authRepository = {
    async findUser(body: any) {
        return  await client.db('blogPlatform').collection('users')
            .findOne({$or: [{login: body}, {email: body}]})
    },

    async addSession(session: PyloadTypeDb) {
        const result =   await client.db('blogPlatform').collection('sessions')
            .insertOne(session)
    },

    async findSession(userId: string, deviceId: string) {
        return   await client.db('blogPlatform').collection('sessions').findOne({userId, deviceId})
    },

    async updateSession(userId:string, deviceId: string, iat: number | undefined, exp: number | undefined) {
        await client.db('blogPlatform').collection('sessions').updateOne(
            { userId, deviceId},
            {$set:{ lastActiveDate: iat, expiration: exp}})
    },

    async deleteSessions(userId: string, deviceId: string) {
        await client.db('blogPlatform').collection('sessions').deleteOne({ userId, deviceId})
    },

    async addRateLimit (rateLimitData: any) {
        await client.db('blogPlatform').collection('ratelimit').insertOne(rateLimitData)
    }
}



export type PyloadTypeDb = {
    userId: ObjectId | string,
    userAgent: string,
    ip: string,
    lastActiveDate: number | undefined
    deviceId: string
    expiration: number | undefined
}