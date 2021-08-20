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
 * 通过邮箱判断用户账号状态是否可用
 */
export const statusIsAvailableByEmail = async (email: string) => {
  // 准备查询
  const statement = `
   SELECT status
   FROM user
   WHERE email = ?
 `;

  // 执行查询
  const [data] = await connection.promise().query(statement, email)

  // 提供数据
  if (data[0]) {
    return data[0].status
  } else {
    return data
  }
}

/**
 * 通过用户名判断用户账号状态是否可用
 */
export const statusIsAvailableByName = async (name: string) => {
  // 准备查询
  const statement = `
   SELECT status
   FROM user
   WHERE name = ?
 `;

  // 执行查询
  const [data] = await connection.promise().query(statement, name)

  // 提供数据
  if (data[0]) {
    return data[0].status
  } else {
    return data
  }
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
  console.log(data);

  return data
}

/**
 * 修改用户状态
 */
export const updateUserStatus = async (email: string) => {
  // 准备查询
  const statement = `
    UPDATE user 
    SET status = 1 
    where email = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, email)

  return data
}