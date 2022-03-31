import { connection } from '../app/database/mysql'
import { GetPostsOptionsPagination } from '../post/post.service';

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
 * 搜索颜色
 */
interface SearchColorsOptions {
  name?: string;
}

export const searchColors = async (options: SearchColorsOptions) => {
  // 解构选项
  const { name } = options

  // SQL 参数
  const params: Array<any> = [`%${name}%`]

  // 准备查询
  const statement = `
    SELECT
      color.id,
      color.name,
      (
        SELECT COUNT(post_color.colorId)
        FROM post_color
        WHERE color.id = post_color.colorId
      ) AS totalPosts
      FROM
        color
      WHERE
        color.name LIKE ?
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
  pagination?: GetPostsOptionsPagination;
}

export const searchUsers = async (options: SearchUsersOptions) => {
  // 解构选项
  const { name, pagination: { limit, offset } } = options

  // SQL 参数
  const params: Array<any> = [`%${name}%`, limit, offset]

  // 准备查询
  const statement = `
    SELECT
      user.id,
      user.name,
      user.synopsis,
      IF(
        COUNT(avatar.id), 1, NULL
      ) AS avatar,
      CAST(
      	IF(
      	  COUNT(file.id),
		      CONCAT(
	      	  '[',
	      	    GROUP_CONCAT(
                DISTINCT JSON_OBJECT(
                  'id', file.id,
                  'postId', file.postId
                )
				      ),
	      	  ']'
      	  ),
		      NULL
      	) AS JSON
      ) AS files,
      (
        SELECT COUNT(post.id)
        FROM post
        WHERE user.id = post.userId
      ) AS totalPosts
    FROM
      user
    LEFT JOIN avatar
      ON avatar.userId = user.id
    LEFT JOIN file
      ON file.userId = user.id
    WHERE
      user.name LIKE ? AND user.status = 1
    GROUP BY
      user.id
    LIMIT ?
    OFFSET ?
  `

  // 执行查询
  const [data] = await connection.promise().query(statement, params)

  // 提供数据
  return data as any
}


/**
 * 搜索相机
 */
interface SearchCamerasOptions {
  makeModel?: string;
}

export const searchCameras = async (options: SearchCamerasOptions) => {
  // 解构选项
  const { makeModel } = options

  // SQL 参数
  const params: Array<any> = [`%${makeModel}%`]

  // 品牌与型号
  const makeModelField = `JSON_EXTRACT(file.metadata, "$.Make", "$.Model")`

  // 准备查询
  const statement = `
    SELECT
      ${makeModelField} as camera,
      COUNT(${makeModelField}) as totalPosts
    FROM
      file
    WHERE
      ${makeModelField} LIKE ? COLLATE utf8mb4_unicode_ci
    GROUP BY
      ${makeModelField}
    LIMIT
     10
  `

  // 执行查询
  const [data] = await connection.promise().query(statement, params)

  // 提供数据
  return data as any
}


/**
 * 搜索镜头
 */
interface SearchlensOptions {
  makeModel?: string;
}

export const searchLens = async (options: SearchlensOptions) => {
  // 解构选项
  const { makeModel } = options

  // SQL 参数
  const params: Array<any> = [`%${makeModel}%`]

  // 品牌与型号
  const makeModelField = `JSON_EXTRACT(file.metadata, "$.LensMake", "$.LensModel")`

  // 准备查询
  const statement = `
    SELECT
      ${makeModelField} as lens,
      COUNT(${makeModelField}) as totalPosts
    FROM
      file
    WHERE
      ${makeModelField} LIKE ? COLLATE utf8mb4_unicode_ci
    GROUP BY
      ${makeModelField}
    LIMIT
     10
  `

  // 执行查询
  const [data] = await connection.promise().query(statement, params)

  // 提供数据
  return data as any
}

/**
 * 按照用户名 搜索用户总数
 */
interface SearchUsersTotalOptions {
  name?: string;
}

export const searchUserTotal = async (options: SearchUsersTotalOptions) => {
  // 解构选项
  const { name } = options

  // SQL 参数
  const params: Array<any> = [`%${name}%`]

  // 准备查询
  const statement = `
    SELECT  
	    COUNT(DISTINCT user.id) AS total
    FROM user
      WHERE user.name like ? AND user.status = 1
  `

  // 执行查询
  const [data] = await connection.promise().query(statement, params)

  // 提供数据
  return data[0].total
}