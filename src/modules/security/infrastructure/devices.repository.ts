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
}