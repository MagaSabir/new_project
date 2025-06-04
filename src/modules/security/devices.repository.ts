import {client} from "../../db/mongoDb";

export const devicesRepository = {
    async deleteOtherSessions (deviceId: string)  {
        const result = await client.db('blogPlatform').collection('sessions').deleteMany({
            deviceId: {$ne: deviceId}
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

    async addRequest(data) {
        await client.db('blogPlatform').collection('rateLimit').insertOne(data)
    },

    async getRequest (ip,url, date) {
        const result = await client.db('blogPlatform').collection('rateLimit').find({
            ip,
            url,
            date: {$gte: date }
        }).toArray()

        return result
    }
}