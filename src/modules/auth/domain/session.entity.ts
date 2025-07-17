import mongoose, {Schema} from "mongoose";

export type SessionType = {
    userId: string,
    deviceId: string,
    userAgent: string,
    ip: string,
    lastActiveDate: string,
    expiration: string
}

export const authSchema = new Schema<SessionType>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    userAgent: { type: String, required: true },
    ip: { type: String, required: true },
    lastActiveDate: { type: String, required: true,},
    expiration: { type: String, require: true},
})



export const AuthModel = mongoose.model('sessions', authSchema)