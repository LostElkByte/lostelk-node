import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'
import _ from 'lodash'
import * as userService from './user.service'

/**
 * 注册 - 验证用户数据
 */
export const validateUserData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log('👮 验证用户数据')

  // 准备数据
  const { name, password, email } = request.body
  const create_time = dayjs().unix()

  // 验证必填数据
  if (!name) return next(new Error('NAME_IS_REQUIRED'))
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'))
  if (!email) return next(new Error('EMAIL_IS_REQUIRED'))

  // 验证用户名格式
  const userNameReg = /^[-_a-zA-Z0-9\u4E00-\u9FA5]{1,20}$/;
  const userNameRegex = userNameReg.test(name)
  if (!userNameRegex) return next(new Error('USER_NAME_INVALID_FORMAT'))

  // 验证邮箱格式
  const userEmailReg = /^$|^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
  const userEmailRegex = userEmailReg.test(email)
  if (!userEmailRegex) return next(new Error('USER_EMAIL_INVALID_FORMAT'))

  // 验证密码格式
  const passwordReg = /^.{6,16}$/;
  const passwordRegex = passwordReg.test(password)
  if (!passwordRegex) return next(new Error('PASSWORD_INVALID_FORMAT'))

  /**
   * 验证邮箱
   */
  const userEmail = await userService.getUserByEmail(email)
  // 验证邮箱是否存在并激活, 如存在并激活则发送错误信息
  if (userEmail && userEmail.status == 1) return next(new Error('USER_EMAIL_ALREADY_EXIST'))

  // 通过邮箱判断账号状态如果为 0 ,并且 距离创建时间 ＞ 1800秒, 则删除此未完成注册记录
  if (userEmail && userEmail.status == 0 && create_time - userEmail.create_time > 1800) {
    await userService.deleteUserByEmail(email)
  }

  // 通过用户名判断账号状态如果为 0 并且 距离创建时间 < 1800秒 , 则提示此邮箱正在注册流程中
  if (userEmail && userEmail.status == 0 && create_time - userEmail.create_time <= 1800) return next(new Error('USER_EMAIL_WAITING_VERIFICATION'))

  /**
   * 验证用户名
   */
  const userName = await userService.getUserByName(name)
  // 验证用户名是否存在并激活, 如存在并激活则发送错误信息
  if (userName && userName.status == 1) return next(new Error('USER_NAME_ALREADY_EXIST'))

  // 通过用户名判断账号状态如果为 0 并且 距离创建时间 ＞ 1800秒 ,则删除此未完成注册记录
  if (userName && userName.status == 0 && create_time - userName.create_time > 1800) {
    await userService.deleteUserByName(name)
  }

  // 通过用户名判断账号状态如果为 0 并且 距离创建时间 < 1800秒 , 则提示用户名已占用
  if (userName && userName.status == 0 && create_time - userName.create_time <= 1800) return next(new Error('USER_NAME_ALREADY_EXIST'))

  // 下一步
  next();
}

/**
 * 注册 - HASH 密码
 */
export const hashPasswordAndEmail = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { password, email } = request.body

  // HASH 密码
  request.body.password = await bcrypt.hash(password, 10)

  // 下一步
  next()
}

/**
* 验证更新用户数据
*/
export const validateUpdateUserData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { validate, update } = request.body

  // 当前用户
  const { id: userId } = request.user

  try {
    // 检查用户是否提供了当前密码
    if (!_.has(validate, 'password')) {
      return next(new Error('PASSWORD_IS_REQUIRED'))
    }

    // 调取用户数据
    const user = await userService.getUserById(userId, { needPassword: true })

    // 验证用户密码是否匹配
    const matched = await bcrypt.compare(validate.password, user.password)

    if (!matched) {
      return next(new Error('PASSWORD_DOES_NOT_MATCH'))
    }

    // 检查用户名是否被占用
    if (update.name) {
      const user = await userService.getUserByName(update.name)

      if (user) {
        return next(new Error('USER_NAME_ALREADY_EXIST'))
      }
    }

    // 处理用户更新密码
    if (update.password) {
      const matched = await bcrypt.compare(update.password, user.password)

      if (matched) {
        return next(new Error('PASSWORD_IS_THE_SAME'))
      }

      // HASH 用户更新密码
      request.body.update.password = await bcrypt.hash(update.password, 10)
    }
  } catch (error) {
    return next(error)
  }

  // 下一步
  next()
}

/**
 * 找回密码 - 验证邮箱是否注册(存在于user表)
 */
export const emailWhetherRegistered = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { email } = request.body

  // 通过邮箱获取用户信息
  const user = await userService.getUserByEmail(email, { needPassword: false })

  // 判断是否存在此邮箱绑定的账号
  if (!user) {
    return next(new Error('USER_NOT_FOUND'))
  }

  // 下一步
  next()
}
