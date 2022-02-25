import { connection } from '../app/database/mysql'

/**
 * 搜索标签
 */
interface SearchTagsOptions {
  name?: string;
}

export const searchTags = async (options: SearchTagsOptions) => {
  // 解构选项
  const { name } = options

  // SQL 参数
  const params: Array<any> = [`%${name}%`]

  // 准备查询
  const statement = `
    SELECT
      tag.id,
      tag.name,
      (
        SELECT COUNT(post_tag.tagId)
        FROM post_tag
        WHERE tag.id = post_tag.tagId
      ) AS totalPosts
      FROM
        tag
      WHERE
        tag.name LIKE ?
      ORDER BY
        totalPosts DESC
      LIMIT
        10
  `

  // 执行查询
  const [data] = await connection.promise().query(statement, params)

  // 提供数据
  return data as any
}

/**
 * 搜索用户
 */
interface SearchUsersOptions {
  name?: string;
}

export const searchUsers = async (options: SearchUsersOptions) => {
  // 解构选项
  const { name } = options

  // SQL 参数
  const params: Array<any> = [`%${name}%`]

  // 准备查询
  const statement = `
    SELECT
      user.id,
      user.name,
      IF(
        COUNT(avatar.id), 1, NULL
      ) AS avatar,
      (
        SELECT COUNT(post.id)
        FROM post
        WHERE user.id = post.userId
      ) AS totalPosts
    FROM
      user
    LEFT JOIN avatar
      ON avatar.userId = user.id
    WHERE
      user.name LIKE ?
    GROUP BY
      user.id
    LIMIT
      10
  `

  // 执行查询
  const [data] = await connection.promise().query(statement, params)

  // 提供数据
  return data as any
}