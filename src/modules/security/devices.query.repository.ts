import {client} from "../../db/mongoDb";

export const devicesQueryRepository = {
    async findDevices () {
        const result =  await client.db('blogPlatform').collection('sessions')
            .find({expiration: {$gt: Math.floor(Date.now() / 1000)}}).toArray()
        return result.map(el => {
            return {
                ip: el.ip,
                title: el.userAgent,
                lastActiveDate: el.lastActiveDate,
                deviceId: el.deviceId
            }
        })
    }
}