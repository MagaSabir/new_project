import {Request, Response} from "express";
import {devicesQueryRepository} from "./devices.query.repository";

export const devicesController = {
    async getDevicesWithActiveSessions (req: Request, res: Response) {

            const result  = await devicesQueryRepository.findDevices()
            res.status(200).send(result)
        }
}