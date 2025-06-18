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
    login: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true },
    isConfirmed: { type: Boolean, required: true },
    confirmationCodeExpiration: { type: String, require: true},
    lastActiveDate: { type: String, require: true}
})

export const AuthModel = mongoose.model('sessions', authSchema)