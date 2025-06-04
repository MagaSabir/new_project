import {Request, Response} from "express";
import {devicesQueryRepository} from "./devices.query.repository";
import {devicesRepository} from "./devices.repository";

export const devicesController = {
    async getDevicesWithActiveSessions (req: Request, res: Response) {
            const result  = await devicesQueryRepository.findDevices()
            res.status(200).send(result)
    },

    async deleteOtherSessions (req: Request, res: Response) {
        const payload = req.payload
        await devicesRepository.deleteOtherSessions(payload.deviceId)
        res.sendStatus(204)
    },

    async deleteSessionsWithId (req: Request, res: Response) {
        const payload = req.payload
        const deviceIdToDelete = req.params.id
        const session = await devicesRepository.findSessionById(deviceIdToDelete)

        if(!session) {
            res.sendStatus(404)
            return
        }
        console.log(session.userId)
        console.log(payload.userId)
        if(payload.userId !== session.userId) {
            res.sendStatus(403)
            return
        }
        const result = await devicesRepository.deleteSessionWithDeviceId( deviceIdToDelete)
        res.sendStatus(204)
    }
}