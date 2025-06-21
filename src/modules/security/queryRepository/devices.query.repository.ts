import {DeviceModel} from "../../../models/schemas/Device.schema";
import {injectable} from "inversify";
import {AuthModel} from "../../../models/schemas/Auth.schema";
@injectable()
export class DevicesQueryRepository {
    async findDevices(userId: string) {
        const result = await AuthModel.
            find({
                userId,
                expiration: {$gt: Math.floor(Date.now() / 1000)}
            }).lean()
        return result.map(el => {
            return {
                ip: el.ip === "::1" ? '127.0.0.1' : el.ip,
                title: el.userAgent,
                lastActiveDate: new Date(Number(el.lastActiveDate) * 1000).toString(),
                deviceId: el.deviceId
            }
        })
    }

    async findSessionById (deviceId: string) {
        return  AuthModel.findOne({deviceId})
    }

    async getRequest (ip: string,url: string, date: number) {
        const result = await DeviceModel.find({
            ip,
            url,
            date: {$gte: date }
        }).lean()

        return result
    }
}