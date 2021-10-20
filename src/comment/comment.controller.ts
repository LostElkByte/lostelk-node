import { Request, Response, NextFunction } from 'express'
import { createComment, isReplyComment, updateComent, deleteComment, getParentId, createReplyComment, updateReplyComment, deleteReplyComment } from './comment.service'
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
    // 如果是回复父级评论
    if (isReplyParentComment == 1) {
      comment = {
        content,
        postId,
        userId,
        parentId: commentIdTurnInt,
        create_time
      }
    } else if (isReplyParentComment == 0) {
      const data = await getParentId(commentIdTurnInt)

      comment = {
        content,
        postId,
        userId,
        parentId: data[0].parentId,
        reply_commentId: commentIdTurnInt,
        create_time
      }

    } else {
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