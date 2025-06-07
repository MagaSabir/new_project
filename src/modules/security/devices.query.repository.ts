import {client} from "../../db/mongoDb";

export const devicesQueryRepository = {
    async findDevices (userId: string, deviceId: string) {
        const result =  await client.db('blogPlatform').collection('sessions')
            .find({
                userId,

                expiration: {$gt: Math.floor(Date.now() / 1000)}}).toArray()
        return result.map(el => {
            return {
                ip: el.ip === "::1" ? '127.0.0.1' : el.ip,
                title: el.userAgent,
                lastActiveDate: new Date(el.lastActiveDate * 1000).toISOString(),
                deviceId: el.deviceId
            }
        })
    }
}