import {NextFunction, Request, Response} from "express";
import {DevicesRepository} from "../../modules/security/repository/devices.repository";
import {QueryUsersRepository} from "../../modules/users/queryRepository/query.users.repository";
import {DevicesQueryRepository} from "../../modules/security/queryRepository/devices.query.repository";
const devicesRepository = new DevicesRepository()
const queryRepository = new DevicesQueryRepository()
export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip
    const url: string = req.originalUrl
    const date = Date.now()

    const tenSeconds = date - 10000

    await devicesRepository.addRequest({ip,url,date})

    const result = await queryRepository.getRequest(ip!, url, tenSeconds)

    if(result.length > 5) {
         res.sendStatus(429)
        return
    }

    next()
}
