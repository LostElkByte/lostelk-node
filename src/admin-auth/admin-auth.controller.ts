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

  const isAdmin = true

  const payload = { id, name, email, isAdmin }

  try {
    // 签发令牌
    const token = signToken({ payload })

    // 做出响应
    response.send({ id, name, email, isAdmin, token });
  } catch (error) {
    next(error)
  }
}