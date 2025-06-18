import mongoose, {HydratedDocument, Schema} from "mongoose";

export type UserViewModel = {
    login: string,
    email: string,
    password: string
    createdAt: string
}


export const userSchema = new Schema({
    login: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
}, {
    timestamps: {createdAt: true, updatedAt: false}
})

export type UserDocument = HydratedDocument<UserViewModel>

export const UserModel  = mongoose.model<UserViewModel>('users', userSchema)