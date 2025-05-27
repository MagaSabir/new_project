import {PayloadType, UserGlobalType} from "./userGlobalType";

declare global {
    namespace Express {
        interface Request {
            user: UserGlobalType,
            payload: PayloadType
        }
    }
}