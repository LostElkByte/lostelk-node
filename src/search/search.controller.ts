import { Request, Response, NextFunction } from 'express'
import { searchTags, searchUsers } from './search.service'

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
    const users = await searchUsers({ name: name.toString() })

    // 做出响应
    response.send(users)
  } catch (error) {
    next(error)
  }
}