import {UserGlobalType} from "./userGlobalType";

declare global {
    namespace Express {
        interface Request {
            user: UserGlobalType
        }
    }
}