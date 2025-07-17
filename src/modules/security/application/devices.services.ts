import {DevicesRepository} from "../infrastructure/devices.repository";
import {DevicesQueryRepository} from "../infrastructure/devices.query.repository";
import {injectable} from "inversify";

@injectable()
export class DevicesServices {
    constructor(
        protected devicesQueryRepository: DevicesQueryRepository,
        protected deviceRepository: DevicesRepository) {
    }

    async findDevices(userId: string) {
        return await this.devicesQueryRepository.findDevices(userId)
    }

    async deleteOtherSessions(deviceId: string, userId: string) {
        return await this.deviceRepository.deleteOtherSessions(deviceId, userId)
    }

    async deleteSessionWithId(deviceId: string) {
        return await this.deviceRepository.deleteSessionWithDeviceId(deviceId)
    }
}