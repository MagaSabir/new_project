import {Request, Response} from "express";
import {devicesQueryRepository} from "../queryRepository/devices.query.repository";
import {devicesRepository} from "../repository/devices.repository";
import {PayloadType} from "../../../common/types/types";

export const devicesController = {
    async getDevicesWithActiveSessions (req: Request, res: Response) {
        const payload: PayloadType = req.payload
            const result  = await devicesQueryRepository.findDevices(payload.userId, payload.deviceId)
            res.status(200).send(result)
    },

    async deleteOtherSessions (req: Request, res: Response) {

        const payload = req.payload
        await devicesRepository.deleteOtherSessions(payload.deviceId, payload.userId)
        res.sendStatus(204)
    },

    async deleteSessionWithId (req: Request, res: Response) {
        const payload = req.payload
        const deviceIdToDelete = req.params.id
        const session = await devicesRepository.findSessionById(deviceIdToDelete)

        if(!session) {
            res.sendStatus(404)
            return
        }

        if(payload.userId !== session.userId) {
            res.sendStatus(403)
            return
        }

        const result = await devicesRepository.deleteSessionWithDeviceId( deviceIdToDelete)
        res.sendStatus(204)
    }
}