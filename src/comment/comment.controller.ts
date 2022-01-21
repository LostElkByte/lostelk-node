import { Request, Response, NextFunction } from 'express'
import { createComment, updateComent, deleteComment, createReplyComment, updateReplyComment, deleteReplyComment, isThisCommentIncludedInPost, getComments, getCommentsTotalCount, getCommentReplies, getCommentsRepliesTotalCount, getCommentById } from './comment.service'
import dayjs from 'dayjs'
import { socketIoServer } from '../app/app.server'

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
    const socketId = request.header('X-Socket-Id')

    const comment = {
      content,
      postId,
      userId,
      create_time
    }
    // 保存评论
    const data = await createComment(comment)

    // 调取新创建的评论
    const createdComment = await getCommentById(data.insertId)

    // 触发事件
    socketIoServer.emit('commentCreated', {
      comment: createdComment,
      socketId,
    })

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
          create_time,
          reply_userId: isIncludeComment[0].userId
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
          create_time,
          reply_userId: isIncludeReplyComment[0].userId
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
  const socketId = request.header('X-Socket-Id')

  try {
    // 删除评论
    const data = await deleteComment(parseInt(commentId, 10))

    // 触发事件
    socketIoServer.emit('commentDelete', {
      commentId: commentId,
      socketId,
    })
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
  // 统计评论数量
  try {
    const totalCount = await getCommentsTotalCount({ filter: request.filter })

    // 设置响应头部
    response.header('X-Total-Count', totalCount)
  } catch (error) {
    next(error)
  }

  // 获取评论列表
  try {
    const comments = await getComments({ filter: request.filter, pagination: request.pagination })

    // 做出响应
    response.send(comments)
  } catch (error) {
    next(error)
  }
}

/**
* 回复列表
*/
export const indexReplies = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { commentId } = request.params

  // 统计回复评论数量
  try {
    const totalCount = await getCommentsRepliesTotalCount(parseInt(commentId, 10))
    // 设置响应头部
    response.header('X-Total-Count', totalCount)
  } catch (error) {
    next(error)
  }

  // 获取评论回复列表
  try {
    const replies = await getCommentReplies({
      commentId: parseInt(commentId, 10),
      pagination: request.pagination
    })

    // 做出响应
    response.send(replies)
  } catch (error) {
    next(error)
  }
}