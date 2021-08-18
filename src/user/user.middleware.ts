import { Request, Response, NextFunction } from 'express'
import * as UserService from './user.service'

/**
 * 验证用户数据
 */
export const validateUserData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log('👮 验证用户数据')

  // 准备数据
  const { name, password, email } = request.body

  // 验证必填数据
  if (!name) return next(new Error('NAME_IS_REQUIRED'))
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'))
  if (!email) return next(new Error('EMAIL_IS_REQUIRED'))

  // 下一步
  next();
}