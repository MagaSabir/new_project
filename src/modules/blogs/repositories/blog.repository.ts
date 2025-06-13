import {BlogType} from "../../../common/types/blogTypes/blogType";
import {blogCollection} from "../../../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb";
import {injectable} from "inversify";
@injectable()
 export class BlogsRepository {
    async createBlog(blog: BlogType): Promise<InsertOneResult> {
        return await blogCollection.insertOne(blog);
    }

    async updateBlog(blog: BlogType, id: string): Promise<boolean> {
        const result: UpdateResult<BlogType> = await blogCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: blog})
        return result.matchedCount === 1
    }

    async deleteBlog(id: string): Promise<boolean> {
        const result: DeleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}