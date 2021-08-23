import { Request, Response, NextFunction } from 'express'
import dayjs from 'dayjs'
import bcrypt from 'bcrypt'
import * as userService from '../user/user.service'

/**
 * 验证用户登录
 */

export const validateLoginData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log('👮 验证用户登陆数据')

  // 准备数据
  const { name, email, password } = request.body
  const create_time = dayjs().unix()

  // 验证必填数据
  if (!name && !email) return next(new Error('NAME_OR_EMAIL_IS_REQUIRED'))
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'))

  /**
   * 通过邮箱验证用户账号
   */
  if (email) {
    const userEmail = await userService.getUserByEmail(email, { needPassword: true })

    // 判断用户是否存在
    if (!userEmail) return next(new Error('USER_DOES_NOT_EXIST'))

    const matched = await bcrypt.compare(password, userEmail.password)
    if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'))

    // 通过邮箱判断账号状态如果为 0 ,并且 距离创建时间 ＞ 1800秒, 则删除此未完成注册记录 并 提示
    if (userEmail && userEmail.status == 0 && create_time - userEmail.create_time > 1800) return next(new Error('PLEASE_RE-REGISTER_BECAUSE_OF_TIMEOUT_ACTIVATION'))

    // 通过用户名判断账号状态如果为 0 并且 距离创建时间 < 1800秒 , 则提示用户进行激活
    if (userEmail && userEmail.status == 0 && create_time - userEmail.create_time <= 1800) return next(new Error('USER_EMAIL_WAITING_VERIFICATION'))

  }

  /**
   * 通过用户名验证用户账号
   */
  if (name) {
    const userName = await userService.getUserByName(name, { needPassword: true })

    // 判断用户是否存在
    if (!userName) return next(new Error('USER_DOES_NOT_EXIST'))

    // 验证用户密码
    const matched = await bcrypt.compare(password, userName.password)
    if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'))

    // 通过用户名判断账号状态如果为 0 并且 距离创建时间 ＞ 1800秒 ,则删除此未完成注册记录
    if (userName && userName.status == 0 && create_time - userName.create_time > 1800) return next(new Error('PLEASE_RE-REGISTER_BECAUSE_OF_TIMEOUT_ACTIVATION'))

    // 通过用户名判断账号状态如果为 0 并且 距离创建时间 < 1800秒 , 则提示用户进行激活
    if (userName && userName.status == 0 && create_time - userName.create_time <= 1800) return next(new Error('USER_EMAIL_WAITING_VERIFICATION'))

  }

  // 下一步
  next();
}