// import {Collection, Db, MongoClient} from "mongodb";
// const localDBString = "mongodb://0.0.0.0:27017/test"
import dotenv from 'dotenv'
import * as mongoose from "mongoose";

dotenv.config()


const db = 'blogPlatform'
export const mongoURI = `mongodb://0.0.0.0:27017/${db}`

export async function runDb() {
    try {
        await mongoose.connect(mongoURI)
        console.log('connected')
    } catch (e) {
        console.log(' no connected')
        await mongoose.disconnect()
    }
}