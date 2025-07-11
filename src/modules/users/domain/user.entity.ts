import mongoose, {HydratedDocument, Model} from "mongoose";
import {CreateUserDto} from "./user.dto";
import bcrypt from "bcrypt";
import {randomUUID} from "crypto";
import {add} from "date-fns";

type UserType = {
    login: string,
    email: string,
    password: string,
    createdAt: Date
    isConfirmed: boolean,
    confirmationCode: string,
    confirmationCodeExpiration: Date;
}

type UserMethods = typeof userMethods //типизация методов экземпляра
type UserStatics = typeof userStatics //типизация статических методов

type UserModel = Model<UserType, {}, UserMethods> & UserStatics; // типизация модели монгусе с методами экземпляра и статики <ТипДокумента, ТипДопМетоды, ТипМетодов>

export type UserDocument = HydratedDocument<UserType, UserMethods> // тип одного документа

const userSchema = new mongoose.Schema<UserType, {}, UserMethods, UserModel>({
    login: {type: String, required: true, minlength: 3, maxlength: 10},
    email: {type: String, required: true, minlength: 6, maxlength: 30},
    password: {type: String, required: true, minlength: 6, maxlength: 60},
    createdAt: {type: Date, required: true, default: Date.now},
    isConfirmed: { type: Boolean, required: true },
    confirmationCode: { type: String, required: true },
    confirmationCodeExpiration: { type: Date, required: true }
})

const userStatics = {
    async createUser(dto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10)
        const user = new UserModel() as UserDocument;
        user.login = dto.login;
        user.password = hashedPassword
        user.email = dto.email;
        user.isConfirmed = true;
        user.confirmationCode = ' ';
        user.confirmationCodeExpiration = new Date()

        return user
    },


    async registerUser(dto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10)
        return new UserModel ({
            login: dto.login,
            password: hashedPassword,
            email: dto.email,
            isConfirmed: false,
            confirmationCode: randomUUID(),
            confirmationCodeExpiration: add(new Date(), { hours: 1, minutes: 30 }),
        })
    }
}


const userMethods = {
    async comparePassword(dto: HydratedDocument<UserType>, password: string) {
        return bcrypt.compare(password, dto.password)
    }
}

// привязка методов к схеме чтобы монгусе знал про методы
userSchema.methods = userMethods
userSchema.statics = userStatics

// создание модели с типами
export const UserModel = mongoose.model<UserType, UserModel>('users', userSchema)