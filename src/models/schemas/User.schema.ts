import mongoose, {HydratedDocument, Schema} from "mongoose";

export type UserEntity = {
    login: string,
    email: string,
    passwordHash: string,
    createdAt: string
}

export type CreateUserDto = {
    login: string
    email: string
    password: string
}


export const userSchema = new Schema({
    login: {type: String, required: true, maxLength: 10, minLength: 3 },
    email: {type: String, required: true},
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true }
})

export type UserDocument = HydratedDocument<UserEntity>

export const UserModel  = mongoose.model<UserEntity>('users', userSchema)