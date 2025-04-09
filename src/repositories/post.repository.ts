import {PostType} from "../types/postTypse/postType";
import {client} from "../db/mongoDb";
import {InsertOneResult, ObjectId, WithId} from "mongodb";
import {PostViewModel} from "../models/post.view.model";

export const postRepository = {
  async findPosts(): Promise<WithId<PostType>[]>  {
    return await client.db('blogPlatform').collection<PostType>('posts').find().toArray()
  },

  async findPost(id: string): Promise<WithId<PostType> | null> {
    return await client.db('blogPlatform').collection<PostType>('posts').findOne({_id: new ObjectId(id)})
  },

  async createPost(newPost: PostType): Promise<PostViewModel> {
    const post: InsertOneResult<PostType> =  await client.db('blogPlatform').collection<PostType>('posts').insertOne(newPost)
    return {
      id: post.insertedId.toString(),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt
    }
  },

  async deletePost(id: string): Promise<boolean> {
    const result = await client.db('blogPlatform').collection('posts').deleteOne({_id: new ObjectId(id)})
    return result.deletedCount === 1
  }
};
