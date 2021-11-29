import { Request, Response, NextFunction } from 'express'
import { createComment, updateComent, deleteComment, createReplyComment, updateReplyComment, deleteReplyComment, isThisCommentIncludedInPost, getComments } from './comment.service'
import dayjs from 'dayjs'

/**
* 发表评论
*/
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // 准备数据
    const { id: userId } = request.user
    const { content, postId } = request.body
    const create_time = dayjs().unix()

    const comment = {
      content,
      postId,
      userId,
      create_time
    }
    // 保存评论
    const data = await createComment(comment)

    // 做出响应
    response.status(201).send(data)
  } catch (error) {
    next(error)
  }
}

/**
* 回复评论
*/
export const reply = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // 准备数据
    const { commentId } = request.params
    const commentIdTurnInt = parseInt(commentId, 10)
    const { id: userId } = request.user
    const { content, postId, isReplyParentComment } = request.body
    const create_time = dayjs().unix()
    let comment

    switch (isReplyParentComment) {
      // 如果是回复父级评论 
      case 1:
        // 判断客户端传来的postId与commentId是否对应
        const isIncludeComment = await isThisCommentIncludedInPost('comment', commentIdTurnInt, postId)
        if (!isIncludeComment[0]) return next(new Error('THIS_COMMENT_NOT_INCLUDED_POST'))

        comment = {
          content,
          postId,
          userId,
          parentId: commentIdTurnInt,
          create_time
        }
        break
      // 如果是回复子级评论 
      case 0:
        // 判断客户端传来的postId与commentId是否对应
        const isIncludeReplyComment = await isThisCommentIncludedInPost('reply_comment', commentIdTurnInt, postId)
        if (!isIncludeReplyComment[0]) return next(new Error('THIS_COMMENT_NOT_INCLUDED_POST'))

        comment = {
          content,
          postId,
          userId,
          parentId: isIncludeReplyComment[0].parentId,
          reply_commentId: commentIdTurnInt,
          create_time
        }
        break
      default:
        return next(new Error('PARAMETER_ERROR'))
    }

    // 回复评论
    const data = await createReplyComment(comment)

    // 做出响应
    response.status(201).send(data)
  } catch (error) {
    next(error)
  }
}

/**
* 修改评论
*/
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { commentId } = request.params
  const { content } = request.body

  const comment = {
    id: parseInt(commentId, 10),
    content
  }

  try {
    // 修改评论
    const data = await updateComent(comment)
    // 做出响应
    response.send(data)
  } catch (error) {
    next(error)
  }
}

/**
* 修改回复评论
*/
export const updateReply = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { reply_commentId } = request.params
  const { content } = request.body

  const comment = {
    id: parseInt(reply_commentId, 10),
    content
  }

  try {

    // 修改评论
    const data = await updateReplyComment(comment)
    // 做出响应
    response.send(data)

  } catch (error) {
    next(error)
  }
}

/**
* 删除评论
*/
export const destroy = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { commentId } = request.params

  try {
    // 删除评论
    const data = await deleteComment(parseInt(commentId, 10))
    // 做出响应
    response.send(data)
  } catch (error) {
    next(error)
  }
}

/**
* 删除回复评论
*/
export const destroyReplyComment = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { reply_commentId } = request.params

  try {
    // 删除评论
    const data = await deleteReplyComment(parseInt(reply_commentId, 10))
    // 做出响应
    response.send(data)
  } catch (error) {
    next(error)
  }
}

/**
* 评论列表
*/
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 获取评论列表
  try {

    const comments = await getComments({ filter: request.filter })

    // 做出响应
    response.send(comments)
  } catch (error) {
    next(error)
  }
}