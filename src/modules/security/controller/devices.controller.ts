import {Request, Response} from "express";

import {PayloadType} from "../../../common/types/types";
import {DevicesServices} from "../services/devices.services";
import {DevicesQueryRepository} from "../queryRepository/devices.query.repository";
import {injectable} from "inversify";

@injectable()
export class DevicesController {
    constructor(protected deviceService: DevicesServices,
                protected queryRepository: DevicesQueryRepository) {
    }

    async getDevicesWithActiveSessions(req: Request, res: Response) {
        const payload: PayloadType = req.payload
        const result = await this.deviceService.findDevices(payload.userId, payload.deviceId)
        console.log(result)
        res.status(200).send(result)
    }

    async deleteOtherSessions(req: Request, res: Response) {
        const payload = req.payload
        await this.deviceService.deleteOtherSessions(payload.deviceId, payload.userId)
        res.sendStatus(204)
    }

    async deleteSessionWithId(req: Request, res: Response) {
        const payload = req.payload
        const deviceIdToDelete = req.params.id
        const session = await this.queryRepository.findSessionById(deviceIdToDelete)
        console.log(session)
        if (!session) {
            res.sendStatus(404)
            return
        }

        if (payload.userId !== session.userId) {
            res.sendStatus(403)
            return
        }

        await this.deviceService.deleteSessionWithId(deviceIdToDelete)
        res.sendStatus(204)
    }
}