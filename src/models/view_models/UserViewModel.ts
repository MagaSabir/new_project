import {ObjectId} from "mongodb";

export type UserViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: Date
}







export type PyloadTypeDb = {
    userId: ObjectId | string,
    userAgent: string,
    ip: string,
    lastActiveDate: number | undefined
    deviceId: string
    expiration: number | undefined
}