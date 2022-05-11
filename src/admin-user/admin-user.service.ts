import { connection } from '../app/database/mysql'
import { AdminUserModel } from './admin-user.model'

/**
* 创建管理员
*/
export const createAdminUser = async (
  adminUser: AdminUserModel
) => {
  // 准备查询
  const statement = `
   INSERT INTO admin_user
   SET ?
 `;

  // 执行查询
  const [data] = await connection.promise().query(statement, adminUser)

  return data
}

/**
 * 获取管理员用户
 */
interface GetUserOptions {
  needPassword?: boolean
}

export const getAdminUser = (condition: string) => {
  return async (param: string | number, options: GetUserOptions = {}) => {
    // 准备选项
    const { needPassword } = options

    // 准备查询
    const statement = `
      SELECT 
      admin_user.id,
      admin_user.name,
      admin_user.email
      ${needPassword ? ', password' : ''}
      FROM admin_user
      WHERE
        ${condition} = ?
    `;

    // 执行查询
    const [data] = await connection.promise().query(statement, param)

    // 提供数据
    return data[0] ? data[0] : null
  }
}

/**
* 按用户名获取管理员
*/
export const getAdminUserByName = getAdminUser('admin_user.name')

/** 
* 按照用户ID获取管理员
*/
export const getAdminUserById = getAdminUser('admin_user.id')

/**
 * 按照邮箱名获取管理员
 */
export const getAdminUserByEmail = getAdminUser('admin_user.email')
