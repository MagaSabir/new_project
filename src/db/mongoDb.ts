import {MongoClient} from "mongodb";

const URI = "mongodb://0.0.0.0:27017/mm"
export const client = new MongoClient(URI)

export async function runDb() {
    try {
        await client.connect()
        await client.db('blogPlatform').command({ping: 1})
        console.log("You successfully connected to MongoDB!")
    } catch {
        await client.close()
    }
}

