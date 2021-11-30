import { connection } from '../app/database/mysql'
import { GetPostsOptionsFilter, GetPostsOptionsPagination } from '../post/post.service';
import { CommentModel } from './comment.model'
import { sqlFragment } from "./comment.provider";

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
 * 1.通过回复评论id查找回复评论的父id
 * 2.判断评论是否位于当前内容下,帖子里有这个评论吗?
 */
export const isThisCommentIncludedInPost = async (
  table: string,
  commentId: number,
  postId: number

) => {
  let statement: string
  if (table === 'comment') {
    // 准备查询
    statement = `
      SELECT *
      FROM comment
      WHERE id = ? AND postId = ?
    `;
  } else if (table === 'reply_comment') {
    // 准备查询
    statement = `
      SELECT *
      FROM reply_comment
      WHERE id = ? AND postId = ?
    `;
  }

  // 执行查询
  const [data] = await connection.promise().query(statement, [commentId, postId])
  console.log(data);

  // 返回结果
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

/**
* 获取评论列表
*/
interface GetCommentsOptions {
  filter?: GetPostsOptionsFilter;
  pagination?: GetPostsOptionsPagination
}

export const getComments = async (options: GetCommentsOptions) => {

  // 解构选项
  const { filter, pagination: { limit, offset } } = options

  // SQL参数
  let params: Array<any> = [limit, offset]

  // 设置 SQL 参数
  if (filter.param) {
    params = [filter.param, ...params]
  }

  // 准备查询
  const statement = `
    SELECT
      comment.id,
      comment.content,
      ${sqlFragment.user},
      ${sqlFragment.post},
      ${sqlFragment.totalReplies}
    FROM
      comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}
    WHERE
     ${filter.sql} 
    GROUP BY
      comment.id
    ORDER BY
      comment.id DESC
    LIMIT ?
    OFFSET ?
  `

  // 执行查询
  const [data] = await connection.promise().query(statement, params)

  // 提供数据
  return data
}

/**
* 统计评论数据
*/
export const getCommentsTotalCount = async (
  options: GetCommentsOptions
) => {
  // 结构参数
  const { filter } = options

  // SQL 参数
  let params: Array<any> = []

  // 设置 SQL 参数
  if (filter.param) {
    params = [filter.param, ...params]
  }

  // 准备查询
  const statement = `
    SELECT
      COUNT(
        DISTINCT comment.id
      ) as total
    FROM 
      comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}
    WHERE
      ${filter.sql}
  `

  // 执行查询
  const [data] = await connection.promise().query(statement, params)

  // 提供结果
  return data[0].total

}