import { Request, Response, NextFunction } from 'express';

/**
 * 输出请求地址
 */
export const requestUrl = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(request.url);
  next();
};

/**
 * 默认异常处理器
 */
export const defaultErrorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error.message) {
    console.log('❌', error.message, '🔚')
  }
  let statusCode: number, message: string;

  /**
   * 处理异常
   */
  switch (error.message) {
    case 'NAME_IS_REQUIRED':
      statusCode = 400;
      message = "Please provide a user name" // 请提供用户名
      break;
    case 'PASSWORD_IS_REQUIRED':
      statusCode = 400;
      message = "Please provide the user password" // 请提供用户密码
      break;
    case 'PASSWORD_IS_THE_SAME':
      statusCode = 400;
      message = "The password to be changed cannot be the same as the old password" // 要修改的密码不能跟原密码一样
      break;
    case 'EMAIL_IS_REQUIRED':
      statusCode = 400;
      message = "Please provide your email address" // 请提供邮箱地址
      break;
    case 'NAME_OR_EMAIL_IS_REQUIRED':
      statusCode = 400;
      message = "Please provide a user name or email address" // 请提供用户名或邮箱
      break;
    case 'USER_NAME_ALREADY_EXIST':
      statusCode = 409;
      message = "The user name is already in use" // 此用户名已被占用
      break;
    case 'USER_EMAIL_ALREADY_EXIST':
      statusCode = 409;
      message = "This email address is registered" // 此邮箱已注册
      break;
    case 'USER_NAME_INVALID_FORMAT':
      statusCode = 400;
      message = "The user name format is incorrect" // 用户名格式错误
      break;
    case 'PASSWORD_INVALID_FORMAT':
      statusCode = 400;
      message = "Incorrect password format" // 密码格式错误
      break;
    case 'USER_EMAIL_INVALID_FORMAT':
      statusCode = 400;
      message = "Email format error" // 邮箱格式错误
      break;
    case 'USER_EMAIL_WAITING_VERIFICATION':
      statusCode = 409;
      message = "Your account is waiting to be activated! The activation link has been sent to your email, please activate within 30 minutes after registration" // 您的账户正在等待激活!激活链接已发送到您的邮箱,请在注册起30分钟内进行激活
      break;
    case 'PLEASE_RE-REGISTER_BECAUSE_OF_TIMEOUT_ACTIVATION':
      statusCode = 409;
      message = "Please register again because activation of this account has timed out" // 由于此账号激活超时,请重新注册
      break;
    case 'USER_DOES_NOT_EXIST':
      statusCode = 409;
      message = "The account or password is incorrect" // 账号或密码错误
      break;
    case 'PASSWORD_DOES_NOT_MATCH':
      statusCode = 409;
      message = "The account or password is incorrect" // 账号或密码错误
      break;
    case 'UNAUTHORIZED':
      statusCode = 401;
      message = "Please login first" // 请先登录
      break;
    case 'USER_DOES_NOT_OWN_RESOURCE':
      statusCode = 403;
      message = "You cannot process this content" // 您不能处理这个内容
      break;
    case 'FILE_NOT_FOUND':
      statusCode = 404;
      message = "File does not exist" // 文件不存在
      break;
    case 'COLOR_ALREADY_EXISTS':
      statusCode = 400;
      message = "Color already exists" // 颜色已存在
      break;
    case 'TAG_ALREADY_EXISTS':
      statusCode = 400;
      message = "Tag already exists" // 标签已存在
      break;
    case 'POST_ALREADY_HAS_THIS_TAG':
      statusCode = 400;
      message = "Post already has this tag" // 帖子已经有这个标签了
      break;
    case 'POST_ALREADY_HAS_THIS_COLOR':
      statusCode = 400;
      message = "Post already has this color label" // 帖子已经有这个颜色标签了
      break;
    case 'PARAMETER_ERROR':
      statusCode = 400;
      message = "Parameter error" // 参数错误
      break;
    case 'THIS_COMMENT_NOT_INCLUDED_POST':
      statusCode = 404;
      message = "The comment you are responding to is not in this post" // 您要回复的评论不在这篇帖子中
      break;
    case 'FILE_TYPE_NOT_ACCEPT':
      statusCode = 400;
      message = "Cannot upload this type of file" // 不能上传此类型的文件
      break;
    case 'NOT_FOUND':
      statusCode = 404;
      message = 'Did not find ~~ 🐹' // 没找到
      break;
    case 'USER_NOT_FOUND':
      statusCode = 404;
      message = 'The user was not found ~~ 🐹' // 没找到这个用户
      break;
    case 'BAD_REQUEST':
      statusCode = 400;
      message = 'Unable to process your request ~~ 🐹' // 无法处理您的请求
      break;
    case 'FORBIDDEN':
      statusCode = 403;
      message = 'No viewing permission' // 没有权限访问
      break;
    case 'TOKEN_TYPE_ISADMIN_CANNOT_BE_USED_FOR_USER_REQUESTS':
      statusCode = 403;
      message = 'Your Token type is administrator and cannot be used for requests from ordinary users' // 您的Token类型为管理员,不能用于普通用户的请求
      break;
    default:
      statusCode = 500;
      message = "There was a temporary problem with the service ~~ 🐿" // 服务暂时出了点问题
      break;
  }

  response.status(statusCode).send({ message })
}