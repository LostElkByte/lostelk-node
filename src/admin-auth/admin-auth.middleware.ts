import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import * as userService from '../admin-user/admin-user.service'

/**
 * 验证用户登录
 */
export const validateLoginData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log('👮 验证管理员用户登陆数据')

  // 准备数据
  const { name, email, password } = request.body

  // 验证必填数据
  if (!name && !email) return next(new Error('NAME_OR_EMAIL_IS_REQUIRED'))
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'))

  /**
   * 通过邮箱验证用户账号
   */
  if (email) {
    const user = await userService.getAdminUserByEmail(email, { needPassword: true })

    // 判断用户是否存在
    if (!user) return next(new Error('USER_DOES_NOT_EXIST'))

    // 验证密码
    const matched = await bcrypt.compare(password, user.password)
    if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'))

    // 在请求主体里添加用户
    request.body.user = user
  }

  /**
   * 通过用户名验证用户账号
   */
  if (name) {
    const user = await userService.getAdminUserByName(name, { needPassword: true })

    // 判断用户是否存在
    if (!user) return next(new Error('USER_DOES_NOT_EXIST'))

    // 验证用户密码
    const matched = await bcrypt.compare(password, user.password)
    if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'))

    // 在请求主体里添加用户
    request.body.user = user
  }

  // 下一步
  next();
}