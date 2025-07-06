import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {PostModel, PostType} from "../../../models/schemas/Post.schema";
import {injectable} from "inversify";

@injectable()
export class PostRepository {
    async save(post: any): Promise<string> {
        const {_id} = await post.save()
        return _id.toString()
    }

    async updatePost(id: string, newPost: PostType): Promise<boolean> {
        const result: UpdateResult<PostType> = await PostModel.updateOne(
            {_id: new ObjectId(id)}, {$set: newPost})
        return result.matchedCount === 1
    }

    async deletePost(id: string): Promise<boolean> {
        const result: DeleteResult = await PostModel.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

}
