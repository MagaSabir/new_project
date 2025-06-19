import {DeviceModel} from "../../../models/schemas/Device.schema";
import {injectable} from "inversify";
@injectable()
export class DevicesRepository  {
    async deleteOtherSessions (deviceId: string, userId: string)  {
        const result = await DeviceModel.deleteMany({
            userId: userId,
            deviceId: {$ne: deviceId}
            //$ne (не равно)
        })
        return result.deletedCount === 1
    }

    // async findSessionById (deviceId: string) {
    //     return  DeviceModel.findOne({deviceId})
    // }

    async deleteSessionWithDeviceId (deviceId: string) {
        const result = await DeviceModel.deleteOne({
            deviceId
        })
        return result.deletedCount === 1
    }

    async addRequest(data: object) {
        await DeviceModel.insertOne(data)
    }
    //$gte (больше или равно)
    //$gt (больше чем)

    // async getRequest (ip: string,url: string, date: number) {
    //     const result = await DeviceModel.find({
    //         ip,
    //         url,
    //         date: {$gte: date }
    //     }).lean()
    //
    //     return result
    // }
}