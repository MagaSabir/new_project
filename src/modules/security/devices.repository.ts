import {client} from "../../db/mongoDb";

export const devicesRepository = {
    async deleteOtherSessions (deviceId: string, userId: string)  {
        const result = await client.db('blogPlatform').collection('sessions').deleteMany({
            userId: userId,
            deviceId: {$ne: deviceId}
            //$ne (не равно)
        })
        return result.deletedCount === 1
    },

    async findSessionById (deviceId: string) {
        return await client.db('blogPlatform').collection('sessions').findOne({deviceId})
    },

    async deleteSessionWithDeviceId (deviceId: string) {
        const result = await client.db('blogPlatform').collection('sessions').deleteOne({
            deviceId
        })
        return result.deletedCount === 1
    },

    async addRequest(data: object) {
        await client.db('blogPlatform').collection('rateLimit').insertOne(data)
    },
    //$gte (больше или равно)
    //$gt (больше чем)

    async getRequest (ip: string,url: string, date: number) {
        const result = await client.db('blogPlatform').collection('rateLimit').find({
            ip,
            url,
            date: {$gte: date }
        }).toArray()

        return result
    }
}