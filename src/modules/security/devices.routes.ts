import {Router} from "express";
import {devicesController} from "./devices.controller";

export const devicesRoutes = Router()

devicesRoutes.get('/devices', devicesController.getDevicesWithActiveSessions)