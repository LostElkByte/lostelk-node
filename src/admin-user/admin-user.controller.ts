import { Request, Response, NextFunction } from 'express'
import { AdminUserModel } from './admin-user.model'
import * as adminUserService from './admin-user.service'

/**
 * 创建管理员
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { name, password, email } = request.body

  // 创建管理员
  try {
    // 创建管理员
    const data = await adminUserService.createAdminUser({ name, password, email })

    response.status(200).send(data)
  } catch (error) {
    next(error)
  }
}
