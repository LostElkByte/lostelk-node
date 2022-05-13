import { Request, Response, NextFunction } from 'express'
import { signToken } from '../auth/auth.service'
import { deleteUserRole, addUserRole, deleteRoleJurisdiction, addRoleJurisdiction } from './admin-auth.service'
/**
 * 管理员登录
 */
export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {

  // 准备数据
  const { user: { id, name, email } } = request.body;

  const isAdmin = true

  const payload = { id, name, email, isAdmin }

  try {
    // 签发令牌
    const token = signToken({ payload })

    // 做出响应
    response.send({ id, name, email, isAdmin, token });
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
  next: NextFunction
) => {
  // 准备数据
  const { userId, roles } = request.body;

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
  next: NextFunction
) => {
  // 准备数据
  const { roleId, jurisdictions } = request.body;

  try {
    // 清空员工角色
    await deleteRoleJurisdiction(roleId)

    // 给员工重新分配角色
    if (!jurisdictions || jurisdictions.length <= 0) return response.sendStatus(200)

    for (const jurisdictionId of jurisdictions) {
      await addRoleJurisdiction(roleId, jurisdictionId)
    }

    response.sendStatus(200)
  } catch (error) {
    next(error)
  }
}