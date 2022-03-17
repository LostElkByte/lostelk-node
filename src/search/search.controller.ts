import { Request, Response, NextFunction } from 'express'
import { searchCameras, searchColors, searchLens, searchTags, searchUsers } from './search.service'
import { getPostsTotalCount } from '../post/post.service'

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

/**
* 搜索帖子总数
*/
export const searchTotal = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let name: string

    // 解构查询符
    let { fuzzyTag, tag, rgbColor, color, cameraMake, cameraModel, lensMake, lensModel } = request.query

    // 按照标签名过滤 - 精准
    if (tag && !color) {
      name = tag.toString()
    }

    // 按照标签名过滤 - 模糊
    if (fuzzyTag && !tag && !color) {
      name = fuzzyTag.toString()
    }

    // 按照颜色名过滤
    if (color && !tag) {
      name = color.toString()
    }

    // 过滤出用某种相机拍摄的内容
    if (cameraMake && cameraModel) {
      name = `${cameraMake.toString()} ${cameraModel.toString()}`
    }

    // 过滤出用某种镜头拍摄的内容
    if (lensMake && lensModel) {
      name = `${lensMake.toString()} ${lensModel.toString()}`
    }

    // 统计内容数量
    const totalCount = await getPostsTotalCount({ filter: request.filter })
    response.send({ name, totalCount })

  } catch (error) {
    next(error)
  }
}