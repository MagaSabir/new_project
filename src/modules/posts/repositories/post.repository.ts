import {PostType} from "../../../common/types/postTypse/postType";
import {postCollection} from "../../../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";

export const postRepository = {
  async findPosts(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: any)  {
    const totalCountPosts: number = await postCollection.countDocuments()

    const posts: WithId<PostType>[] =  await postCollection
        .find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({[sortBy]: sortDirection})
        .toArray()
    return { posts , totalCountPosts }
  },

  async findPost(id: string): Promise<WithId<PostType> | null> {
    return await postCollection.findOne({_id: new ObjectId(id)})
  },

  async createPost(newPost: PostType): Promise<InsertOneResult<PostType>> {
    return await postCollection.insertOne(newPost)
  },

  async updatePost(id: string, newPost: PostType): Promise<boolean> {
    const result: UpdateResult<PostType> = await postCollection.updateOne(
        {_id: new ObjectId(id)}, {$set: newPost})
    return result.matchedCount === 1
  },

  async deletePost(id: string): Promise<boolean> {
    const result: DeleteResult = await postCollection.deleteOne({_id: new ObjectId(id)})
    return result.deletedCount === 1
  }
};
