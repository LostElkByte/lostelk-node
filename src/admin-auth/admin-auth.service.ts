import jwt from 'jsonwebtoken'
import { PRIVATE_KEY } from '../app/app.config'
import { connection } from '../app/database/mysql'

/**
 * 删除员工角色
 */
export const deleteUserRole = async (userId: number) => {
  // 准备查询
  const statement = `
    DELETE FROM admin_user_role
    WHERE admin_user_role.adminUserId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId)

  // 提供数据
  return data
}

/**
 * 新增员工角色
 */
export const addUserRole = async (userId: number, roleId: number) => {
  // 准备查询
  const statement = `
    INSERT INTO admin_user_role 
    SET adminUserId = ?,adminRoleId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, [userId, roleId])

  // 提供数据
  return data
}

/**
 * 删除角色权限
 */
export const deleteRoleJurisdiction = async (roleId: number) => {
  // 准备查询
  const statement = `
    DELETE FROM admin_role_jurisdiction
    WHERE admin_role_jurisdiction.adminRoleId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, roleId)

  // 提供数据
  return data
}

/**
 * 新增角色权限
 */
export const addRoleJurisdiction = async (roleId: number, jurisdictionId: number) => {
  // 准备查询
  const statement = `
    INSERT INTO admin_role_jurisdiction 
    SET adminRoleId = ?,adminJurisdictionId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, [roleId, jurisdictionId])

  // 提供数据
  return data
}

/**
 * 查询用户角色
 */
export const selectUserRoleByUserId = async (userId: number) => {
  // 准备查询
  const statement = `
    SELECT 
      adminRoleId,
      admin_role.role
    FROM admin_user_role
    LEFT JOIN admin_role
      ON admin_user_role.adminRoleId = admin_role.id
    WHERE adminUserId = ?
  `

  // 执行查询
  const [data] = await connection.promise().query(statement, userId)

  // 提供数据
  return data
}


/**
 * 查询角色权限
 */
export const selectRoleJurisdictionByRoleId = async (roleId: number) => {
  // 准备查询
  const statement = `
    SELECT
      adminJurisdictionId,
      admin_jurisdiction.jurisdiction
    FROM admin_role_jurisdiction
    LEFT JOIN admin_jurisdiction
      ON admin_role_jurisdiction.adminJurisdictionId = admin_jurisdiction.id
    WHERE adminRoleId = ?
  `

  // 执行查询
  const [data] = await connection.promise().query(statement, roleId)

  // 提供数据
  return data
}
