import { Request, Response, NextFunction } from 'express'
import { searchTags } from './search.service'

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