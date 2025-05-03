import {PostType} from "../../../common/types/postTypse/postType";
import {client, commentCollection, db, postCollection} from "../../../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb";

export const postRepository = {
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
  },


};
