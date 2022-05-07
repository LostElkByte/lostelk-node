import { colord } from 'colord'
import { rgbToHex } from '../file/file.service'
import { Request, Response, NextFunction } from 'express'
import { partial } from 'lodash'
import colorNameTranslateChinese from '../color/colorNameTranslateChinese'
import { PostStatus } from './post.service'

/**
* 排序方式
*/
export const sort = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 获取客户端的排序方式
  const { sort } = request.query

  // 排序用的 SQL
  let sqlSort: string

  // 设置排序用的 SQL
  switch (sort) {
    case 'earliest':
      sqlSort = 'post.id ASC'
      break
    case 'latest':
      sqlSort = 'post.id DESC'
      break
    case 'most_comments':
      sqlSort = 'totalComments DESC, post.id DESC'
      break
    default:
      sqlSort = 'post.id DESC'
      break
  }

  // 在请求里添加排序
  request.sort = sqlSort

  // 下一步
  next()
}

/**
* 过滤列表
*/
export const filter = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 解构查询符
  let { fuzzyTag, tag, rgbColor, color, user, action, cameraMake, cameraModel, lensMake, lensModel } = request.query

  // 如果是rgbColor, 转换为文字颜色
  if (rgbColor) {
    rgbColor = JSON.parse(rgbColor.toString())

    // RBG转HEX
    const hexColor = rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2])

    // 将HEX转为W3C颜色名
    const colorName = colord(hexColor).toName({ closest: true })

    // W3C颜色名转中文颜色
    const chinesecolorName = colorNameTranslateChinese(colorName) as Array<string>

    // 取第一个颜色
    color = chinesecolorName[0]
  }

  // 设置默认的过滤
  request.filter = {
    name: 'default',
    sql: 'post.id IS NOT NULL',
  }

  // 按照标签名过滤 - 精准
  if (tag && !color && !user && !action) {
    request.filter = {
      name: 'tagName',
      sql: 'tag.name = ?',
      param: tag.toString(),
    }
  }

  // 按照标签名过滤 - 模糊
  if (fuzzyTag && !tag && !color && !user && !action) {
    request.filter = {
      name: 'tagName',
      sql: 'tag.name like ?',
      param: `%${fuzzyTag.toString()}%`,
    }
  }

  // 按照颜色名过滤
  if (color && !tag && !user && !action) {
    request.filter = {
      name: 'colorName',
      sql: 'color.name like ?',
      param: `%${color.toString()}%`,
    }
  }

  // 过滤出用户发布的内容
  if (user && action == 'published' && !tag && !color) {
    request.filter = {
      name: 'userPublished',
      sql: 'user.id = ?',
      param: user.toString()
    }
  }

  // 过滤出用户赞过的内容
  if (user && action == 'liked' && !tag && !color) {
    request.filter = {
      name: 'userLiked',
      sql: 'user_like_post.userId = ?',
      param: user.toString()
    }
  }

  // 过滤出用某种相机拍摄的内容
  if (cameraMake && cameraModel) {
    request.filter = {
      name: 'camera',
      sql: `file.metadata->'$.Make' = ? AND file.metadata->'$.Model' = ?`,
      params: [cameraMake.toString(), cameraModel.toString()],
    }
  }

  // 过滤出用某种镜头拍摄的内容
  if (lensMake && lensModel) {
    request.filter = {
      name: 'lens',
      sql: `file.metadata->'$.lensMake' = ? AND file.metadata->'$.lensModel' = ?`,
      params: [lensMake.toString(), lensModel.toString()],
    }
  }

  // 下一步
  next()
}

/**
* 内容分页
*/
export const paginate = (itemsPerPage: number) => {
  return async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    // 当前页码
    const { page = 1 } = request.query

    // 每页内容数量
    const limit = itemsPerPage || 30

    // 计算出偏移量
    const offset = limit * (Number(page) - 1)

    // 设置请求中的分页
    request.pagination = { limit, offset }

    // 下一步
    next()
  }
}

/**
 * 验证内容状态
 */
export const validatePostStatus = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { status: statusFromQuery = '' } = request.query
  const { status: statusFromBody = '' } = request.body

  const status = statusFromQuery || statusFromBody

  // 检查内容状态是否有效
  const isValidStatus = ['published', 'draft', 'archived', ''].includes(status)

  if (!isValidStatus) {
    next(new Error('BAD_REQUEST'))
  } else {
    next()
  }
}

/**
* 模式切换器
*/
export const modeSwitcher = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 解构查询符
  let { manage, admin } = request.query

  // 用户管理模式
  const isManageMode = manage === 'true'

  // 管理员模式
  const isAdminMode = isManageMode && admin === 'true' && request.user.id === 1

  if (isManageMode) {
    if (isAdminMode) {
      request.filter = {
        name: 'adminManagePosts',
        sql: 'post.id IS NOT NULL',
        param: '',
      }
    } else {
      request.filter = {
        name: 'userManagePosts',
        sql: 'user.id = ?',
        param: `${request.user.id}`,
      }
    }
  } else {
    // 普通模式
    request.query.status = PostStatus.published
  }

  // 下一步
  next()
}