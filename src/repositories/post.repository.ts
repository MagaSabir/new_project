import {PostType} from "../types/postTypse/postType";
import {client} from "../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";

export const postRepository = {
  async findPosts(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: any)  {
    const totalCountPosts: number = await client.db('blogPlatform').collection('posts').countDocuments()

    const posts: WithId<PostType>[] =  await client.db('blogPlatform').collection<PostType>('posts')
        .find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({[sortBy]: sortDirection})
        .toArray()
    return { posts , totalCountPosts }
  },

  async findPost(id: string): Promise<WithId<PostType> | null> {
    return await client.db('blogPlatform').collection<PostType>('posts').findOne({_id: new ObjectId(id)})
  },

  async createPost(newPost: PostType): Promise<InsertOneResult<PostType>> {
    return await client.db('blogPlatform').collection<PostType>('posts').insertOne(newPost)
  },

  async updatePost(id: string, newPost: PostType): Promise<boolean> {
    const result: UpdateResult<PostType> = await client.db('blogPlatform').collection('posts').updateOne(
        {_id: new ObjectId(id)}, {$set: newPost})
    return result.matchedCount === 1
  },

  async deletePost(id: string): Promise<boolean> {
    const result: DeleteResult = await client.db('blogPlatform').collection('posts').deleteOne({_id: new ObjectId(id)})
    return result.deletedCount === 1
  }
};
