import {Collection, Db, MongoClient} from "mongodb";
const localDBString = "mongodb://0.0.0.0:27017/test"
import dotenv from 'dotenv'
import {SETTINGS} from "../settings";
import {BlogType} from "../common/types/blogTypes/blogType";
import {PostType} from "../common/types/postTypse/postType";
import {CommentType} from "../models/CommentModel";
import {CreatedUserType} from "../common/types/userType/userType";
dotenv.config()

const URI =  process.env.MONGO_URL || localDBString
const USER_COLLECTION = 'users'
const BLOG_COLLECTION = 'blogs'
const POST_COLLECTION = 'posts'
const COMMENT_COLLECTIONS = 'comments'



export let client: MongoClient;
export let blogCollection: Collection<BlogType>
export let postCollection: Collection<PostType>
export let commentCollection: Collection<CommentType>
export let usersCollections: Collection<CreatedUserType>
export let db: Db


export async function runDb() {
     client = new MongoClient(URI)
     db = client.db(SETTINGS.DB_NAME)
    blogCollection = db.collection(BLOG_COLLECTION)
    postCollection = db.collection(POST_COLLECTION)
    commentCollection = db.collection(COMMENT_COLLECTIONS)
    usersCollections = db.collection(USER_COLLECTION)

    try {
        await client.connect()
        await client.db('blogPlatform').command({ping: 1})
       } catch {
        await client.close()
    }
}


