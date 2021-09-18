import { Request, Response, NextFunction } from 'express'
import { createComment } from './comment.service'
import dayjs from 'dayjs'

/**
* 发表评论
*/
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
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

  try {
    // 保存评论
    const data = await createComment(comment)

    // 做出响应
    response.status(201).send(data)
  } catch (error) {
    next(error)
  }

}