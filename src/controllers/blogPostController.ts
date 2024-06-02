
import { AppDataSource } from "../database/data-source";
import { CategoryService } from "../services/CategoryService";
import { BlogPostService } from "../services/blogPostService";
import { Tag } from "../database/models/Tag";

export class BlogPostController {

    static getPosts = async (req, res) => {
        try {
            let number = req.query.page
            if (!number) number = 1
            let qr = {
                pageSize: 10,
                pageNumber: number,
            }
            const queries = req.body
            const categories = await CategoryService.handleGetCategory(null)
            const status = ['draft', 'pending', 'published', 'trash']
            let response: any = await BlogPostService.getPosts({ ...qr, ...queries });
            //@ts-ignore
            return res.render("blog/blogPost.ejs", { data: response.postDatas, status: status, categories: categories.data });

        } catch (e) {
            console.log(e);
            res.status(500).json({
                errCode: -1,
                errMessage: "Error from server!"
            })
        }
    }
    static formPosts = async (req, res) => {
        try {
            const { id } = req.params
            let pageName: 'Add New' | 'Update'
            id ? pageName = 'Update' : pageName = 'Add New'
            const status = ['draft', 'pending', 'published', 'trash']
            const categories = await CategoryService.handleGetCategory(null)
            const tags = await AppDataSource.getRepository(Tag).createQueryBuilder("tag")
                .select(["tag.name"])
                .getMany();
            const post = await BlogPostService.getBlogById(id)
            if (id)
                //@ts-ignore
                return res.render("blog/blogPostForm.ejs", { categories: categories.data, page: pageName, postData: post, status: status, id: id, tags: tags });
            //@ts-ignore
            return res.render("blog/blogPostForm.ejs", { categories: categories.data, page: pageName, postData: null, status: status, id: null, tags: tags });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                errCode: -1,
                errMessage: "Error from server!"
            })
        }
    }
    static async deletePost(req, res) {
        try {

            const { id } = req.params
            await BlogPostService.deleteBlog(Number(id))
            return res.json({ message: 'Xóa thành công!' });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Lỗi" });
        }
    }

    static async createPost(req, res) {
        try {
            const data = req.body
            const newPost = await BlogPostService.createBlogPost({ ...data, userId: 1, status: 'draft' })
            return res.status(200).json({ message: "Tạo thành công blog", data: newPost })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Tạo không thành công", error: error })
        }
    }
    static async updatePost(req, res) {
        try {
            const { id } = req.params
            const data = req.body
            const newPost = await BlogPostService.updateBlog(id, data)
            return res.status(200).json({ message: "Sửa thành công blog", data: newPost })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Sửa không thành công", error: error })
        }
    }

}
