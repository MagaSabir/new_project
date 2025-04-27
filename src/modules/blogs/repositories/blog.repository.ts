import {BlogType} from "../../../common/types/blogTypes/blogType";
import {blogCollection, postCollection} from "../../../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb";
import {PostType} from "../../../common/types/postTypse/postType";

export const blogRepository = {
  async createBlog(newBlog: BlogType): Promise<InsertOneResult> {
    return  await blogCollection.insertOne(newBlog);
  },

  async updateBlog(newBlog: BlogType, id: string): Promise<boolean> {
    const result: UpdateResult<BlogType> = await blogCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: newBlog })
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
