import mongoose, {Schema} from "mongoose";

export type CreatedUserType = {
    login: string,
    password?: string
    email: string,
    createdAt: string,
    isConfirmed?: boolean,
    confirmationCodeExpiration?: string | Date
}





export const authSchema = new Schema({
    userId: { type: String, required: false },
    deviceId: { type: String, required: false },
    userAgent: { type: String, required: false },
    ip: { type: String, required: false },
    lastActiveDate: { type: String, required: false },
    expiration: { type: String, require: false},
})



export const AuthModel = mongoose.model('sessions', authSchema)