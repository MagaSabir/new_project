import {NextFunction, Request, Response} from "express";
import {devicesRepository} from "../../modules/security/devices.repository";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip
    const url: string = req.originalUrl
    const date = Date.now()

    const tenSeconds = date - 10000

    await devicesRepository.addRequest({ip,url,date})

    const result = await devicesRepository.getRequest(ip!, url, tenSeconds)

    if(result.length > 5) {
         res.sendStatus(429)
        return
    }

    next()
}
