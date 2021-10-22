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
  `,
	leftJoinOnefile: `
		LEFT JOIN LATERAL (
			SELECT *
			FROM file
			WHERE file.postId = post.id
			ORDER BY file.id DESC
			LIMIT 1
		) AS file ON post.id = file.postId
	`,
	file: `
		CAST(
			IF(
				COUNT(file.id),
				GROUP_CONCAT(
					DISTINCT JSON_OBJECT(
						'id', file.id,
						'width', file.width,
						'height', file.height
					)
				),
				NULL
			) AS JSON
		)	AS file
	`
}