import {MongoClient} from "mongodb";
const localDBString = "mongodb://0.0.0.0:27017/mm"
const URI = /*process.env.MONGO_URL ||*/ localDBString
export const client = new MongoClient(URI)

export async function runDb() {
    try {
        await client.connect()
        await client.db('blogPlatform').command({ping: 1})
       if(URI === process.env.MONGO_URL) console.log("You successfully connected to atlas MongoDB!")
       else  console.log("You successfully connected to local MongoDB!")
    } catch {
        await client.close()
    }
}


