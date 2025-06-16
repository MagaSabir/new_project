import {BlogType} from "../../../common/types/blogTypes/blogType";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {injectable} from "inversify";
import {BlogModel} from "../../../db/mongoDb";


@injectable()
export class BlogsRepository {
    async createBlog(blog: BlogType) {
        const savedBlog = await BlogModel.create(blog);
        console.log(savedBlog)
        return savedBlog._id.toString()
    }

    async updateBlog(blog: BlogType, id: string): Promise<boolean> {
        const result: UpdateResult<BlogType> = await BlogModel.updateOne(
            {_id: new ObjectId(id)},
            {$set: blog})
        return result.matchedCount === 1
    }

    async deleteBlog(id: string): Promise<boolean> {
        const result: DeleteResult = await BlogModel.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}