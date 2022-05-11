import { Request, Response, NextFunction, request } from 'express'
import dayjs from 'dayjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as userService from '../user/user.service'
import { PUBLIC_KEY } from '../app/app.config'
import { TokenPayload } from './auth.interface'
import { possess } from '../auth/auth.service'

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
    const user = await userService.getUserByEmail(email, { needPassword: true })

    // 判断用户是否存在
    if (!user) return next(new Error('USER_DOES_NOT_EXIST'))

    // 验证密码
    const matched = await bcrypt.compare(password, user.password)
    if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'))

    // 通过邮箱判断账号状态如果为 0 ,并且 距离创建时间 ＞ 1800秒, 则提示此账号激活超时,请重新注册
    if (user && user.status == 0 && create_time - user.create_time > 1800) return next(new Error('PLEASE_RE-REGISTER_BECAUSE_OF_TIMEOUT_ACTIVATION'))

    // 通过用户名判断账号状态如果为 0 并且 距离创建时间 < 1800秒 , 则提示用户进行激活
    if (user && user.status == 0 && create_time - user.create_time <= 1800) return next(new Error('USER_EMAIL_WAITING_VERIFICATION'))

    // 在请求主体里添加用户
    request.body.user = user


  }

  /**
   * 通过用户名验证用户账号
   */
  if (name) {
    const user = await userService.getUserByName(name, { needPassword: true })

    // 判断用户是否存在
    if (!user) return next(new Error('USER_DOES_NOT_EXIST'))

    // 验证用户密码
    const matched = await bcrypt.compare(password, user.password)
    if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'))

    // 通过用户名判断账号状态如果为 0 并且 距离创建时间 ＞ 1800秒 ,则提示此账号激活超时,请重新注册
    if (user && user.status == 0 && create_time - user.create_time > 1800) return next(new Error('PLEASE_RE-REGISTER_BECAUSE_OF_TIMEOUT_ACTIVATION'))

    // 通过用户名判断账号状态如果为 0 并且 距离创建时间 < 1800秒 , 则提示用户进行激活
    if (user && user.status == 0 && create_time - user.create_time <= 1800) return next(new Error('USER_EMAIL_WAITING_VERIFICATION'))

    // 在请求主体里添加用户
    request.body.user = user

  }


  // 下一步
  next();
}

/**
 * 验证用户身份
 */
export const authGuard = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log('👮 验证用户身份');

  if (request.user.id) {
    next();
  } else {
    next(new Error('UNAUTHORIZED'))
  }
}

/**
 * 当前用户
 */
export const currentUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 未登录的用户
  let user: TokenPayload = {
    id: null,
    name: 'anonymous'
  }

  try {
    //提取 Authorization
    const authorization = request.header('Authorization')

    // 提取 JWT 令牌
    const token = authorization.replace('Bearer ', '')

    if (token) {
      // 验证令牌
      const decoded = jwt.verify(token, PUBLIC_KEY, {
        algorithms: ['RS256']
      })

      user = decoded as TokenPayload
    }

  } catch (error) { }

  // 在请求里添加当前用户
  request.user = user

  // 下一步
  next()
}

/**
 * 普通用户访问控制
 */
interface AccessControlOptions {
  possession?: boolean;
}

export const accessControl = (options: AccessControlOptions) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    console.log('👮 访问控制');

    // 解构选项
    const { possession } = options

    // 当前用户 ID
    const { id: userId, isAdmin } = request.user

    // 如果是后台账号
    if (isAdmin) {
      return next(new Error('TOKEN_TYPE_ISADMIN_CANNOT_BE_USED_FOR_USER_REQUESTS'))
    }

    // 放行管理员
    if (userId == 1) return next()

    // 准备资源
    const resourceIdParam = Object.keys(request.params)[0]
    const resourceType = resourceIdParam.replace('Id', '')
    const resourceId = parseInt(request.params[resourceIdParam], 10)

    // 检查资源拥有权
    if (possession) {
      try {
        const ownResource = await possess({ resourceId, resourceType, userId })

        if (!ownResource) {
          return next(new Error('USER_DOES_NOT_OWN_RESOURCE'))
        }
      } catch (error) {
        return next(error)
      }
    }

    // 下一步
    next()
  }
}