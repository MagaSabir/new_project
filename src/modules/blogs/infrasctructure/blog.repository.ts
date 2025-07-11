import {DeleteResult, ObjectId} from "mongodb";
import {injectable} from "inversify";
import {BlogDocument, BlogModel, BlogType} from "../domain/blog.entity";


@injectable()
export class BlogsRepository {
    async save(blog: BlogDocument): Promise<ObjectId> {
        const {_id} = await blog.save()
        return _id
    }

    async updateBlog(blog: BlogType, id: string): Promise<boolean> {
        const result = await BlogModel.updateOne(
            {_id: new ObjectId(id)},
            {$set: blog})
        return result.matchedCount === 1
    }

    async deleteBlog(id: string): Promise<boolean> {
        const result: DeleteResult = await BlogModel.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}