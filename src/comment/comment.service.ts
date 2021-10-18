import { connection } from '../app/database/mysql'
import { CommentModel } from './comment.model'

/**
* 创建评论
*/
export const createComment = async (
  comment: CommentModel
) => {
  // 准备查询
  const statement = `
    INSERT INTO comment
    SET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, comment)

  // 提供数据
  return data
}

/**
* 检查评论是否为回复评论
*/
export const isReplyComment = async (
  commentId: number
) => {
  //准备查询
  const statement = `
    SELECT parentId FROM comment
    WHERE id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, commentId)

  // 返回结果
  return data[0].parentId ? true : false
}

/**
* 修改评论
*/
export const updateComent = async (
  comment: CommentModel
) => {
  // 准备数据
  const { id, content } = comment

  // 准备查询
  const statement = `
    UPDATE comment
    SET content = ?
    WHERE id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, [content, id])

  // 返回结果
  return data
}

/**
* 删除评论
*/
export const deleteComment = async (
  commentId: number
) => {
  // 准备查询
  const statement = `
    DELETE FROM comment
    WHERE id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, commentId)

  // 提供数据
  return data
}

/**
* 创建回复评论
*/
export const createReplyComment = async (
  comment: CommentModel
) => {
  // 准备查询
  const statement = `
    INSERT INTO reply_comment
    SET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, comment)

  // 提供数据
  return data
}

/**
 * 通过回复评论id查找回复评论的父id
 */
export const getParentId = async (
  id: number
) => {
  // 准备查询
  const statement = `
    SELECT parentId 
    FROM reply_comment 
    WHERE id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, id)

  // 提供数据
  return data
}

/**
* 修改回复评论
*/
export const updateReplyComment = async (
  comment: CommentModel
) => {
  // 准备数据
  const { id, content } = comment

  // 准备查询
  const statement = `
    UPDATE reply_comment
    SET content = ?
    WHERE id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, [content, id])

  // 返回结果
  return data
}


/**
* 删除回复评论
*/
export const deleteReplyComment = async (
  commentId: number
) => {
  // 准备查询
  const statement = `
    DELETE FROM reply_comment
    WHERE id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, commentId)

  // 提供数据
  return data
}


