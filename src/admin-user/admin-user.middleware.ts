import { Request, Response, NextFunction } from 'express'
import * as adminUserService from './admin-user.service'

/**
 * 注册 - 验证管理员数据
 */
export const validateAdminUserData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log('👮 验证管理员数据')

  // 准备数据
  const { name, password, email } = request.body

  // 验证必填数据
  if (!name) return next(new Error('NAME_IS_REQUIRED'))
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'))
  if (!email) return next(new Error('EMAIL_IS_REQUIRED'))

  // 验证管理员用户名格式
  const userNameReg = /^[-_a-zA-Z0-9\u4E00-\u9FA5]{1,20}$/;
  const userNameRegex = userNameReg.test(name)
  if (!userNameRegex) return next(new Error('USER_NAME_INVALID_FORMAT'))

  // 验证管理员邮箱格式
  const userEmailReg = /^$|^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
  const userEmailRegex = userEmailReg.test(email)
  if (!userEmailRegex) return next(new Error('USER_EMAIL_INVALID_FORMAT'))

  // 验证管理员密码格式
  const passwordReg = /^.{6,16}$/;
  const passwordRegex = passwordReg.test(password)
  if (!passwordRegex) return next(new Error('PASSWORD_INVALID_FORMAT'))

  /**
   * 验证管理员邮箱
   */
  const userEmail = await adminUserService.getAdminUserByEmail(email)
  // 验证管理员邮箱是否存在并激活, 如存在则发送错误信息
  if (userEmail) return next(new Error('USER_EMAIL_ALREADY_EXIST'))


  /**
   * 验证管理员用户名
   */
  const userName = await adminUserService.getAdminUserByName(name)
  // 验证管理员用户名是否存在并激活, 如存在则发送错误信息
  if (userName) return next(new Error('USER_NAME_ALREADY_EXIST'))

  // 下一步
  next();
}