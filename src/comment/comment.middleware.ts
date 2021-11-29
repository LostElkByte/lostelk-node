import { Request, Response, NextFunction } from 'express'

/**
* 过滤器
*/
export const filter = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 解构查询符
  const { post, user, action } = request.query

  // 默认的过滤
  request.filter = {
    name: 'default',
    sql: 'comment.parentId IS NULL'
  }

  // 内容的评论
  if (post && !user && !action) {
    request.filter = {
      name: 'postComments',
      sql: 'comment.postId = ?',
      param: post.toString()
    }
  }

  // 用户的评论
  if (user && action == 'published' && !post) {
    request.filter = {
      name: 'userPublished',
      sql: 'comment.userId = ?',
      param: user.toString()
    }
  }

  // 下一步
  next()
}