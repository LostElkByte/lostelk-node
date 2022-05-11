import { Request, Response, NextFunction } from 'express'
import { signToken } from '../auth/auth.service'

/**
 * 管理员登录
 */
export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {

  // 准备数据
  const { user: { id, name, email } } = request.body;

  const payload = { id, name, email }

  try {
    // 签发令牌
    const token = signToken({ payload })

    // 做出相应
    response.send({ id, name, email, token });
  } catch (error) {
    next(error)
  }
}