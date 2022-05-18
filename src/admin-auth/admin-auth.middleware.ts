import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import * as userService from '../admin-user/admin-user.service'
import { selectRoleJurisdictionByRoleId, selectUserRoleByUserId } from './admin-auth.service'
import _ from 'lodash'

/**
 * 验证员工登录
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


/**
 * 后台访问控制
 */
interface backgroundManagementAccessControlOptions {
  needPossession?: boolean
  jurisdictionId?: number
}

export const backgroundManagementAccessControl = (options: backgroundManagementAccessControlOptions) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    console.log('👮 后台访问控制');

    // 解构选项
    const { needPossession, jurisdictionId } = options

    // 当前用户 ID
    const { id: userId, isAdmin } = request.user

    // 如果是前台账号
    if (!isAdmin) {
      return next(new Error('TOKEN_TYPE_IS_USER_CANNOT_BE_USED_FOR_ADMIN_REQUESTS'))
    }

    // 放行超级管理员
    if (userId == 1) return next()

    // 放行无需权限控制接口
    if (!needPossession) return next()

    // 查询用户角色
    const data = await selectUserRoleByUserId(userId)
    const userRoles = Object.values(JSON.parse(JSON.stringify(data)))

    // 权限集合
    let jurisdictionList = []

    // 查询权限
    for (const role of userRoles) {
      const { adminRoleId } = role as any
      const data = await selectRoleJurisdictionByRoleId(adminRoleId)
      const roleJurisdictions = Object.values(JSON.parse(JSON.stringify(data)))
      for (const jurisdiction of roleJurisdictions) {
        const { adminJurisdictionId } = jurisdiction as any
        jurisdictionList.push(adminJurisdictionId)
      }
    }

    // 权限集合去重
    jurisdictionList = _.uniq(jurisdictionList)

    const isNext = jurisdictionList.includes(jurisdictionId)

    if (isNext) {
      return next()
    } else {
      return next(new Error('FORBIDDEN'))
    }
    // 下一步
    next()
  }
}
