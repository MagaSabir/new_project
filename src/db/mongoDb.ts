import {Collection, Db, MongoClient} from "mongodb";
const localDBString = "mongodb://0.0.0.0:27017/test"
import dotenv from 'dotenv'
import {SETTINGS} from "../settings";
import {BlogType} from "../types/blogTypes/blogType";
import {PostType} from "../types/postTypse/postType";
dotenv.config()

const URI = process.env.MONGO_URL || localDBString
const USER_COLLECTION = 'users'
const BLOG_COLLECTION = 'blogs'
const POST_COLLECTION = 'posts'

export let client: MongoClient;
export let blogCollection: Collection<BlogType>
export let postCollection: Collection<PostType>
export let db: Db
export const testClient = new MongoClient("mongodb://0.0.0.0:27017/test")

export async function runDb() {
     client = new MongoClient(URI)
     db = client.db(SETTINGS.DB_NAME)
    blogCollection = db.collection(BLOG_COLLECTION)
    postCollection = db.collection(POST_COLLECTION)

    try {
        await client.connect()
        await client.db('blogPlatform').command({ping: 1})
       if(URI === process.env.MONGO_URL) console.log("You successfully connected to atlas MongoDB!")
       else  console.log("You successfully connected to local MongoDB!")
    } catch {
        await client.close()
    }
}


