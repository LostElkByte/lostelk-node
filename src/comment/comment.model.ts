export class CommentModel {
  id?: number;
  content?: string;
  postId?: number;
  userId?: number;
  parentId?: number;
  reply_commentId?: number;
  create_time?: number;
  child_comments?: string
}