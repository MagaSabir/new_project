import {Router} from "express";
import {refreshMiddleware} from "../../../common/middlewares/refresh.middleware";
import {container} from "../../../composition-root";
import {DevicesController} from "./devices.controller";

export const devicesController = container.get(DevicesController)
export const devicesRoutes = Router()

devicesRoutes
    .get('/devices', refreshMiddleware,devicesController.getDevicesWithActiveSessions.bind(devicesController))
    .delete('/devices', refreshMiddleware, devicesController.deleteOtherSessions.bind(devicesController))
    .delete('/devices/:id', refreshMiddleware, devicesController.deleteSessionWithId.bind(devicesController))