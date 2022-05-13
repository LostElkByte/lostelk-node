import { Request, Response, NextFunction } from 'express'
import { signToken } from '../auth/auth.service'
import { deleteUserRole, addUserRole, deleteRoleJurisdiction, addRoleJurisdiction, selectUserRoleByUserId, selectRoleJurisdictionByRoleId, selectAllRole } from './admin-auth.service'
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

/**
 * 查询用户角色
 */
export const selectUserRole = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { userId } = request.params;

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
  next: NextFunction
) => {
  // 准备数据
  const { roleId } = request.params;

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
  next: NextFunction
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