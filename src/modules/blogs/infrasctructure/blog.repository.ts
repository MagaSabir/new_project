import {DeleteResult, ObjectId} from "mongodb";
import {injectable} from "inversify";
import {BlogDocument, BlogModel} from "../domain/blog.entity";


@injectable()
export class BlogsRepository {
    async save(blog: BlogDocument): Promise<string> {
        const {_id} = await blog.save()
        return _id.toString()
    }

    async deleteBlog(id: string): Promise<boolean> {
        const result: DeleteResult = await BlogModel.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

    async findBlogById(id: string): Promise<BlogDocument | null> {
        return BlogModel.findById(id)
    }
}