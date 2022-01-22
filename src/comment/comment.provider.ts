/**
 * SQL 查询片段
 */
export const sqlFragment = {
  leftJoinUser: `
    LEFT JOIN user
      ON user.id = comment.userId
    LEFT JOIN avatar
      ON user.id = avatar.userId
  `,
  replyCommentLeftJoinUser: `
    LEFT JOIN user
      ON user.id = reply_comment.userId
    LEFT JOIN avatar
      ON user.id = avatar.userId
  `,
  user: `
    JSON_OBJECT(
      'id', user.id,
      'name', user.name,
      'avatar', IF(COUNT(avatar.id), 1, NULL)
    ) AS user
  `,
  repliesUser: `
    (
   	 	SELECT
   	 	 JSON_OBJECT(
   	 	  'id', user.id,
	      'name', user.name,
	      'avatar', IF(COUNT(avatar.id), 1, NULL)
	       )
	 	  FROM
	 		  user
      LEFT JOIN avatar
        ON user.id = avatar.userId
	  	WHERE
      	user.id = reply_comment.reply_userId
   	) AS replyUser
  `,
  leftJoinPost: `
    LEFT JOIN post
      ON post.id = comment.postId
  `,
  post: `
    JSON_OBJECT(
      'id', post.id,
      'title', post.title
    ) AS post
  `,
  totalReplies: `
    (
      SELECT
        COUNT(reply_comment.id)
      FROM
        reply_comment
      WHERE comment.id = reply_comment.parentId
    ) AS totalReplies
  `
}