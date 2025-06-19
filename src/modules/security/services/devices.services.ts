import {DevicesRepository} from "../repository/devices.repository";
import {DevicesQueryRepository} from "../queryRepository/devices.query.repository";
import {Request, Response} from "express";
import {injectable} from "inversify";
@injectable()
export class DevicesServices {
    constructor(
        protected devicesQueryRepository: DevicesQueryRepository,
        protected deviceRepository: DevicesRepository) {}

    async findDevices(userId: string, deviceId: string) {
        return await this.devicesQueryRepository.findDevices(userId)
    }

    async deleteOtherSessions (deviceId: string, userId: string) {
        return await this.deviceRepository.deleteOtherSessions(deviceId, userId)
    }

    async deleteSessionWithId (deviceId: string) {
        return await this.deviceRepository.deleteSessionWithDeviceId(deviceId)
    }
}