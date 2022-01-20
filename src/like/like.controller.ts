import { Request, Response, NextFunction } from 'express'
import { socketIoServer } from '../app/app.server'
import { createUserLikePost, deleteUserLikePost } from './like.service'

/**
* 点赞内容
*/
export const storeUserLikePost = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { postId } = request.params
  const { id: userId } = request.user
  const socketId = request.header('X-Socket-Id')

  // 点赞内容
  try {
    const data = await createUserLikePost(userId, parseInt(postId, 10))

    // 触发事件
    socketIoServer.emit('userLikePostCreated', {
      postId: parseInt(postId, 10),
      userId,
      socketId
    })

    // 做出响应
    response.status(201).send(data)
  } catch (error) {
    next(error)
  }
}

/**
* 取消点赞内容
*/
export const destroyUserLikePost = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { postId } = request.params
  const { id: userId } = request.user
  const socketId = request.header('X-Socket-Id')

  // 取消点赞内容
  try {
    const data = await deleteUserLikePost(userId, parseInt(postId, 10))

    // 触发事件
    socketIoServer.emit('userLikePostDelete', {
      postId: parseInt(postId, 10),
      userId,
      socketId
    })


    // 做出响应
    response.status(201).send(data)
  } catch (error) {
    next(error)
  }
}
