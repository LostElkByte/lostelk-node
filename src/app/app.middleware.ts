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
      message = "请提供用户名"
      break;
    case 'PASSWORD_IS_REQUIRED':
      statusCode = 400;
      message = "请提供用户密码"
      break;
    case 'EMAIL_IS_REQUIRED':
      statusCode = 400;
      message = "请提供邮箱地址"
      break;
    case 'NAME_OR_EMAIL_IS_REQUIRED':
      statusCode = 400;
      message = "请提供用户名或邮箱"
      break;
    case 'USER_NAME_ALREADY_EXIST':
      statusCode = 409;
      message = "此用户名已被占用"
      break;
    case 'USER_EMAIL_ALREADY_EXIST':
      statusCode = 409;
      message = "此邮箱已注册"
      break;
    case 'USER_NAME_INVALID_FORMAT':
      statusCode = 400;
      message = "用户名格式错误"
      break;
    case 'PASSWORD_INVALID_FORMAT':
      statusCode = 400;
      message = "密码格式错误"
      break;
    case 'USER_EMAIL_INVALID_FORMAT':
      statusCode = 400;
      message = "邮箱格式错误"
      break;
    case 'USER_EMAIL_WAITING_VERIFICATION':
      statusCode = 409;
      message = "您的账户正在等待激活!激活链接已发送到您的邮箱,请在注册起30分钟内进行激活"
      break;
    case 'PLEASE_RE-REGISTER_BECAUSE_OF_TIMEOUT_ACTIVATION':
      statusCode = 409;
      message = "由于此账号激活超时,请重新注册"
      break;
    case 'USER_DOES_NOT_EXIST':
      statusCode = 409;
      message = "账号或密码错误"
      break;
    case 'PASSWORD_DOES_NOT_MATCH':
      statusCode = 409;
      message = "账号或密码错误"
      break;
    case 'UNAUTHORIZED':
      statusCode = 401;
      message = "请先登录"
      break;
    case 'USER_DOES_NOT_OWN_RESOURCE':
      statusCode = 403;
      message = "您不能处理这个内容"
      break;
    case 'FILE_NOT_FOUND':
      statusCode = 404;
      message = "文件不存在"
      break;
    case 'TAG_ALREADY_EXISTS':
      statusCode = 400;
      message = "标签已存在"
      break;
    case 'POST_ALREADY_HAS_THIS_TAG':
      statusCode = 400;
      message = "内容已经有这个标签了"
      break;
    case 'PARAMETER_ERROR':
      statusCode = 400;
      message = "参数错误"
      break;
    default:
      statusCode = 500;
      message = "服务暂时出了点问题 ~~ 🐿"
      break;
  }

  response.status(statusCode).send({ message })
}