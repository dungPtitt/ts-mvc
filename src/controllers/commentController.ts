
import { CommentService } from "../services/CommentService";
import { CategoryService } from "../services/CategoryService";
import { BlogPostService } from "../services/blogPostService";

export class CommentController {

    static getComments = async (req, res) => {
        try {
            let comments: any = await CommentService.getAllComments();
            return res.render("comment/comment.ejs", { data: comments });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                errCode: -1,
                errMessage: "Error from server!"
            })
        }
    }
    // static formPosts = async (req, res) => {
    //     try {
    //         const { id } = req.params
    //         let pageName: 'Add New' | 'Update'
    //         id ? pageName = 'Update' : pageName = 'Add New'
    //         const status = ['draft', 'pending', 'published', 'trash']
    //         const categories = await CategoryService.handleGetCategory(null)
    //         const post = await BlogPostService.getBlogById(id)
    //         if (id)
    //             //@ts-ignore
    //             return res.render("blog/blogPostForm.ejs", { categories: categories.data, page: pageName, postData: post, status: status, id: id });
    //         //@ts-ignore
    //         return res.render("blog/blogPostForm.ejs", { categories: categories.data, page: pageName, postData: null, status: status, id: null });
    //     } catch (e) {
    //         console.log(e);
    //         res.status(500).json({
    //             errCode: -1,
    //             errMessage: "Error from server!"
    //         })
    //     }
    // }
    static async deleteComment(req, res) {
        try {

            const { id } = req.params
            await CommentService.deleteComment(Number(id))
            return res.json({ message: 'Xóa thành công!' });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Lỗi" });
        }
    }

    // static async createPost(req, res) {
    //     try {
    //         const data = req.body
    //         const newPost = await BlogPostService.createBlogPost({ ...data, userId: 1, status: 'draft' })
    //         return res.status(200).json({ message: "Tạo thành công blog", data: newPost })
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json({ message: "Tạo không thành công", error: error })
    //     }
    // }
    static async hideComment(req, res) {
        try {
            const { id } = req.params
            const status = req.query.status
            let data: { status: string } = { status: '' }
            status == 'hide' ? data.status = 'show' : data.status = 'hide'
            const newPost = await CommentService.updateComment(id, data)
            return res.status(200).json({ message: "Ẩn/hiện comment thành công", data: newPost })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Ẩn/hiện comment không thành công", error: error })
        }
    }

}
