import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'
import { signToken } from '../auth/auth.service'
import {
  deleteUserRole,
  addUserRole,
  deleteRoleJurisdiction,
  addRoleJurisdiction,
  selectUserRoleByUserId,
  selectRoleJurisdictionByRoleId,
  selectAllRole,
  selectAllJurisdiction,
} from './admin-auth.service'
/**
 * 管理员登录
 */
export const login = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    user: { id, name, email },
  } = request.body

  const isAdmin = true

  const payload = { id, name, email, isAdmin }

  try {
    // 签发令牌
    const token = signToken({ payload })

    // 做出响应
    response.send({ id, name, email, isAdmin, token })
  } catch (error) {
    next(error)
  }
}

/**
 * 分配角色
 */
export const assignRoles = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { userId, roles } = request.body

  try {
    // 清空员工角色
    await deleteUserRole(userId)

    // 给员工重新分配角色
    if (!roles || roles.length <= 0) return response.sendStatus(200)

    for (const roleId of roles) {
      await addUserRole(userId, roleId)
    }

    response.sendStatus(200)
  } catch (error) {
    next(error)
  }
}

/**
 * 分配权限
 */
export const assignJurisdiction = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { roleId, jurisdictions } = request.body

  try {
    // 清空员工角色
    await deleteRoleJurisdiction(roleId)

    // 给员工重新分配角色
    if (!jurisdictions || jurisdictions.length <= 0)
      return response.sendStatus(200)

    for (const jurisdictionId of jurisdictions) {
      await addRoleJurisdiction(roleId, jurisdictionId)
    }

    response.sendStatus(200)
  } catch (error) {
    next(error)
  }
}

/**
 * 查询用户角色
 */
export const selectUserRole = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { userId } = request.params

  try {
    // 查询用户角色
    const roles = await selectUserRoleByUserId(parseInt(userId))

    response.status(200).send(roles)
  } catch (error) {
    next(error)
  }
}

/**
 * 查询角色权限
 */
export const selectRoleJurisdiction = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { roleId } = request.params

  try {
    // 查询用户角色
    const jurisdictions = await selectRoleJurisdictionByRoleId(parseInt(roleId))

    response.status(200).send(jurisdictions)
  } catch (error) {
    next(error)
  }
}

/**
 * 查询所有角色
 */
export const selectRole = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    // 查询角色
    const roles = await selectAllRole()

    response.status(200).send(roles)
  } catch (error) {
    next(error)
  }
}

/**
 * 查询所有权限
 */
export const selectJurisdiction = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    // 查询权限
    const roles = await selectAllJurisdiction()

    response.status(200).send(roles)
  } catch (error) {
    next(error)
  }
}

/**
 * 查询当前用户权限
 */
export const selectUserJurisdiction = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 当前用户 ID
  const { id: userId } = request.user

  try {
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

      for (const item of roleJurisdictions) {
        const { adminJurisdictionId, jurisdiction } = item as any
        jurisdictionList.push({
          id: adminJurisdictionId,
          jurisdictionName: jurisdiction,
        })
      }
    }

    // 权限集合去重
    jurisdictionList = _.uniq(jurisdictionList)

    response.status(200).send(jurisdictionList)
  } catch (error) {
    next(error)
  }
}
