import { AppDataSource } from "../database/data-source"

import { validateOrReject } from "class-validator"
import { CreateCommentDto, UpdateCommentDto } from "../dtos/CommentDTO"
import { Comment } from "../database/models/Comment"
export class CommentService {

  static async createComment(data: any): Promise<{}> {
    const parentCommentId = data.parent
    const repo = AppDataSource.getRepository(Comment)
    if (parentCommentId) {
      const check = await repo.findOne({ where: { id: Number(parentCommentId) } })
      if (!check) throw new Error("Parent comment not found")
    }
    const dto = new CreateCommentDto()
    Object.assign(dto, data)
    await validateOrReject(dto)
    return await repo.query(`insert into comments (content, blogPostId, userId${parentCommentId ? ',parentComment' : ''}) values ('${data.content}',${data.blogPostId},${data.userId}${parentCommentId ? ',' + parentCommentId : ''})`)
  }

  static async getComments(postId?: number): Promise<{}> {

    const repo = AppDataSource.getRepository(Comment);
    let query = 'SELECT * FROM comments WHERE parentComment IS NULL';
    if (postId) {
      query = query + ` AND blogPostId = ${postId}`;
    }
    const getCmt = await repo.query(query);
    const cmtData = await Promise.all(getCmt.map(async (cmt: any) => {
      const subComments = await CommentService.getChildrenComments(cmt);
      return { ...cmt, comments: subComments };
    }));
    return cmtData
  }
  static async getAllComments(): Promise<{}> {

    const repo = AppDataSource.getRepository(Comment);
    let query = 'SELECT comments.id, comments.content, blog_post.title, users.username, comments.imgUrl, comments.likeCount, comments.shareCount, comments.replyCount, comments.status, comments.createdAt, comments.updatedAt, comments.deletedAt FROM comments INNER JOIN blog_post ON blog_post.id = comments.blogPostId INNER JOIN users ON users.id = comments.userId'
    const getCmt = await repo.query(query);
    return getCmt
  }
  static async getChildrenComments(comment: any) {
    const repo = AppDataSource.getRepository(Comment)
    const children = await repo.query(`SELECT * FROM comments WHERE parentComment = ${comment.id}`);

    if (children.length === 0) {
      return [];
    }

    const childComments = [];

    for (const child of children) {
      const subComments = await CommentService.getChildrenComments(child);
      //@ts-ignore
      childComments.push({ ...child, comments: subComments });
    }

    return childComments;
  }
  static async getListComment(parentComment: number, blogPostId: number, page: number, pageSize: number) {
    const repo = AppDataSource.getRepository(Comment)
    let listComment;
    let count = 0;
    //lay ra danh sach comment cha cua bai blog
    if (blogPostId) {
      // let query = `SELECT * FROM comments WHERE blogPostId = ${blogPostId} AND parentComment IS NULL`;
      // listComment = await repo.query(query);
      listComment = await repo.createQueryBuilder('comment')
        .select(['comment.id', 'comment.content', 'comment.createdAt', 'comment.deletedAt', 'comment.likeCount', 'comment.shareCount', 'comment.replyCount', 'comment.dislikeCount', 'comment.createdDate', 'comment.imgUrl', 'user.id'])
        .where('comment.blogPostId = :blogPostId AND comment.parentComment IS NULL', { blogPostId: blogPostId })
        .orderBy("comment.id", "DESC")
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .leftJoin('comment.user', 'user')
        .getMany()
      count = await repo.createQueryBuilder('comment')
        .where('comment.blogPostId = :blogPostId AND comment.parentComment IS NULL', { blogPostId: blogPostId })
        .getCount()

    }
    else if (parentComment) {
      // listComment = await repo.query(`SELECT * FROM comments WHERE parentComment = ${parentComment}`)
      listComment = await repo.createQueryBuilder('comment')
        .select(['comment.id', 'comment.content', 'comment.createdAt', 'comment.deletedAt', 'comment.likeCount', 'comment.shareCount', 'comment.replyCount', 'comment.dislikeCount', 'comment.createdDate', 'comment.imgUrl', 'user.id'])
        .where('comment.parentComment = :parentComment', { parentComment: parentComment })
        .orderBy("comment.id", "DESC")
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .leftJoin('comment.user', 'user')
        .getMany()
      count = await repo.createQueryBuilder('comment')
        .where('comment.parentComment = :parentComment', { parentComment })
        .getCount()
    }
    let data = {
      count: count,
      listComment: listComment
    }
    return data;
  }
  static async deleteComment(id: number): Promise<void> {
    const repo = AppDataSource.getRepository(Comment)

    try {
      const comment = await repo.findOneOrFail({ where: { id } })
      if (!comment) {
        throw new Error("Comment not found")
      }
      await repo.remove(comment)
    } catch (error) {
      console.log(error)
      // Handle errors
      throw new Error("Error occurred while deleting comment")
    }
  }
  static async updateComment(id: number, blogData: UpdateCommentDto): Promise<Comment> {
    const repo = AppDataSource.getRepository(Comment)

    try {
      const blog = await repo.findOneOrFail({ where: { id } })
      Object.assign(blog, blogData)
      await validateOrReject(blog)
      await repo.save(blog)
      return blog
    } catch (error) {
      console.log(error)
      throw new Error("Error occurred while updating blog post")
    }
  }
}
