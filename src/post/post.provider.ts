/**
 * 查询片段
 */
export const sqlFragment = {
  user: `
  JSON_OBJECT(
    'id', user.id,
    'name', user.name
  ) as suer
  `,
  leftJoinUser: `
    LEFT JOIN user
    ON user.id = post.userId
  `,
  totalComments: `
  (
		(SELECT 
			COUNT(comment.id)
		FROM
			comment
		WHERE 
			comment.postId = post.id)
		+
		(SELECT 
			COUNT(reply_comment.id)
		FROM
			reply_comment
		WHERE 
			reply_comment.postId = post.id)
	) as totalComments
  `
}