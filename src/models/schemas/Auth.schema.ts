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
    login: { type: String, required: false },
    password: { type: String, required: false },
    email: { type: String, required: false },
    createdAt: { type: String, required: false },
    isConfirmed: { type: Boolean, required: false },
    confirmationCodeExpiration: { type: String, require: false},
    lastActiveDate: { type: String, require: false}
})

export const AuthModel = mongoose.model('sessions', authSchema)