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
 * 存储邮箱验证码
 */
export const setEmailVerifyKey = async (email: string, verify_key: string) => {
  // 准备查询
  const statement = `
    UPDATE user 
    SET verify_key = ? 
    where email = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, [verify_key, email])

  return data
}

/**
 * 修改用户状态
 */
export const updateUserStatus = async (email: string, status: number) => {
  // 准备查询
  const statement = `
    UPDATE user 
    SET status = ? 
    where email = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, [status, email])

  return data
}

/**
 * 按用户名查找用户
 */
export const getUserByName = async (name: string) => {
  // 准备查询
  const statement = `
    SELECT id, name, email, status, create_time
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
    SELECT id, name, email, status, create_time
    FROM user
    WHERE email = ?
  `;
  // 执行查询
  const [data] = await connection.promise().query(statement, email)

  // 提供数据
  return data[0]
}

/**
 * 通过邮箱查询校验码, 创建时间
 */
export const getVerift_key = async (email: string) => {
  // 准备查询
  const statement = `
    SELECT verify_key, create_time
    FROM user
    WHERE email = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, email)

  return data[0]
}

/**
 * 通过邮箱删除账号
 */
export const deleteUserByEmail = async (email: string) => {
  // 准备查询
  const statement = `
    DELETE
    FROM user
    WHERE email = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, email)

  return data
}

/**
 * 通过用户名删除账号
 */
export const deleteUserByName = async (name: string) => {
  // 准备查询
  const statement = `
    DELETE
    FROM user
    WHERE name = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, name)

  return data
}

/**
 * 清空 verift_key
 */
export const deleteVerift_key = async (email: string) => {
  // 准备查询
  const statement = `
  UPDATE user
  SET verify_key = ? 
  WHERE email = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, ['', email])

  return data
}
