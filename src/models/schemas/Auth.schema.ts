import mongoose, {Schema} from "mongoose";

export type CreatedUserType = {
    login: string,
    password?: string
    email: string,
    createdAt: string,
    isConfirmed?: boolean,
    confirmationCodeExpiration?: string | Date
}


// export const authSchema = new Schema({
//     login: { type: String, required: false },
//     password: { type: String, required: false },
//     email: { type: String, required: false },
//     createdAt: { type: String, required: false },
//     isConfirmed: { type: Boolean, required: false },
//     confirmationCodeExpiration: { type: String, require: false},
//     lastActiveDate: { type: String, require: false}
// })


export const authSchema = new Schema({
    userId: { type: String, required: false },
    deviceId: { type: String, required: false },
    userAgent: { type: String, required: false },
    ip: { type: String, required: false },
    lastActiveDate: { type: String, required: false },
    expiration: { type: String, require: false},
})

// userId
// "684c227ad5b25ee129336399"
// deviceId
// "29c75584-92c4-4e22-9e21-e35359a7a3b3"
// userAgent
// "mobile"
// ip
// "::ffff:127.0.0.1"
// lastActiveDate
// 1749820026
// expiration


export const AuthModel = mongoose.model('sessions', authSchema)