import { connection } from '../app/database/mysql'
import { UserModel } from './user.model'

/**
 * 创建用户
 */
export const createUser = async (user: UserModel) => {
  // 准备查询
  const statement = `
    INSERT INTO user
    SET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, user)

  return data
}

/**
 * 按用户名查找用户
 */
export const getUserByName = async (name: string) => {
  // 准备查询
  const statement = `
    SELECT id, name
    FROM user
    WHERE name = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, name)

  // 提供数据
  return data[0]
}

/**
 * 按照邮箱名查找用户
 */
export const getUserByEmail = async (email: string) => {
  // 准备查询
  const statement = `
    SELECT id, name, email
    FROM user
    WHERE email = ?
  `;
  // 执行查询
  const [data] = await connection.promise().query(statement, email)

  // 提供数据
  return data[0]
}
