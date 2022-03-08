import { Request, Response, NextFunction } from 'express'
import { searchCameras, searchColors, searchLens, searchTags, searchUsers } from './search.service'

/**
* 搜索标签
*/
export const tags = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // 准备关键词
    const { name } = request.query

    // 查询标签
    const tags = await searchTags({ name: name.toString() })

    // 做出响应
    response.send(tags)
  } catch (error) {
    next(error)
  }
}

/**
* 搜索标签
*/
export const colors = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // 准备关键词
    const { name } = request.query

    // 查询标签
    const colors = await searchColors({ name: name.toString() })

    // 做出响应
    response.send(colors)
  } catch (error) {
    next(error)
  }
}


/**
* 搜索用户
*/
export const users = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // 准备关键词
    const { name } = request.query

    // 查询用户
    const users = await searchUsers({ name: name.toString(), pagination: request.pagination })

    // 做出响应
    response.send(users)
  } catch (error) {
    next(error)
  }
}

/**
* 搜索相机
*/
export const cameras = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // 准备关键词
    const { makeModel } = request.query

    // 查询
    const cameras = await searchCameras({ makeModel: makeModel.toString() })

    // 做出响应
    response.send(cameras)
  } catch (error) {
    next(error)
  }
}

/**
* 搜索相机
*/
export const lens = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // 准备关键词
    const { makeModel } = request.query

    // 查询
    const lens = await searchLens({ makeModel: makeModel.toString() })

    // 做出响应
    response.send(lens)
  } catch (error) {
    next(error)
  }
}