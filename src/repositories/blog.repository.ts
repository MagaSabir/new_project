import {BlogType} from "../types/blogTypes/blogType";
import {client} from "../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";
import {BlogViewModel} from "../models/BlogViewModel";

export const blogRepository = {
  async findBlogs(): Promise<WithId<BlogType>[]> {
    return await client.db('blogPlatform').collection<BlogType>('blogs').find().toArray()
  },

  async findBlog(id: string): Promise<WithId<BlogType> | null> {
    return  await client.db("blogPlatform").collection<BlogType>('blogs').findOne({_id: new ObjectId(id)});
  },

  async createBlog(newBlog: BlogType): Promise<BlogViewModel> {
    const blog: InsertOneResult<BlogType> =  await client.db("blogPlatform").collection<BlogType>('blogs').insertOne(newBlog);
    return {
      id: blog.insertedId.toString(),
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership
    }
  },

  async updateBlog(newBlog: BlogType, id: string): Promise<Boolean> {
    const result: UpdateResult<BlogType> = await client.db('blogPlatform').collection<BlogType>('blogs').updateOne({
      _id: new ObjectId(id) }, { $set: newBlog })
    return result.matchedCount === 1
  },

  async deleteBlog(id: string) {
    const result: DeleteResult = await client.db('blogPlatform').collection<BlogType>('blogs').deleteOne({_id: new ObjectId(id)})
    return result.deletedCount === 1
  },
};
