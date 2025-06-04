import {Router} from "express";
import {devicesController} from "./devices.controller";
import {refreshMiddleware} from "../../common/middlewares/refresh.middleware";

export const devicesRoutes = Router()

devicesRoutes
    .get('/devices', refreshMiddleware,devicesController.getDevicesWithActiveSessions)
    .delete('/devices', refreshMiddleware, devicesController.deleteOtherSessions)
    .delete('/devices/:id', refreshMiddleware, devicesController.deleteSessionsWithId)