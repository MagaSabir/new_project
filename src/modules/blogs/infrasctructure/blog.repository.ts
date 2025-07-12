import {DeleteResult, ObjectId} from "mongodb";
import {injectable} from "inversify";
import {BlogDocument, BlogModel, BlogType} from "../domain/blog.entity";


@injectable()
export class BlogsRepository {
    async save(blog: BlogDocument): Promise<string> {
        const {_id} = await blog.save()
        return _id.toString()
    }

    async updateBlog(blog: BlogDocument) {
        await blog.save()
    }

    async deleteBlog(id: string): Promise<boolean> {
        const result: DeleteResult = await BlogModel.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

    async findBlogById(id: string) {
        return  BlogModel.findById(id)
    }
}