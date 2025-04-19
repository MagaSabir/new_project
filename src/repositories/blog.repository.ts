import {BlogType} from "../types/blogTypes/blogType";
import {blogCollection, client, postCollection} from "../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";
import {PostType} from "../types/postTypse/postType";

export const blogRepository = {
  async findBlogs(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, searchNameTerm: string): Promise<{blog: WithId<BlogType>[];totalCountBlogs: number; }> {
    const filter = searchNameTerm ? {name: {$regex: searchNameTerm, $options:'i'}} : {}

    const totalCountBlogs: number = await blogCollection.countDocuments(filter)

    const blog: WithId<BlogType>[] =  await client.db('blogPlatform').collection<BlogType>('blogs').find(filter)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({[sortBy]: sortDirection})
        .toArray()
    return { blog, totalCountBlogs }
  },

  async findPosts(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, id: string) {
    const totalCountPosts: number = await postCollection.countDocuments({blogId: id})

    const posts = await postCollection.find({blogId: id})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({[sortBy]: sortDirection})
        .toArray()
    return{ totalCountPosts, posts}
  },

  async findBlog(id: string): Promise<WithId<BlogType> | null> {
    return  await blogCollection.findOne({_id: new ObjectId(id)});
  },

  async createBlog(newBlog: BlogType): Promise<InsertOneResult> {
    return  await blogCollection.insertOne(newBlog);
  },

  async updateBlog(newBlog: BlogType, id: string): Promise<boolean> {
    const result: UpdateResult<BlogType> = await blogCollection.updateOne({
      _id: new ObjectId(id) }, { $set: newBlog })
    return result.matchedCount === 1
  },

  async deleteBlog(id: string): Promise<boolean> {
    const result: DeleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)})
    return result.deletedCount === 1
  },

  async createPostByBlogId(newPost: PostType): Promise<InsertOneResult<PostType>> {
    return await postCollection.insertOne(newPost)
  }
};
