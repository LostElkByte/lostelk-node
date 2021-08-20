import { Request, Response, NextFunction } from 'express'
import { UserModel } from './user.model'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { sendRegisterEmail } from '../app/nodemailer'
import * as userService from './user.service'

/**
 * 创建用户
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { name, password, email } = request.body
  const create_time = dayjs().unix()

  // 创建用户
  try {
    // 创建用户
    const data = await userService.createUser({ name, password, email, create_time })

    // 生成邮箱验证码
    const verify_key = uuidv4();

    // 存储邮箱验证码
    await userService.setEmailVerifyKey(email, verify_key)

    // 发送校验邮箱
    sendRegisterEmail({ name, email, verify_key });

    response.status(201).send(data)
  } catch (error) {
    next(error)
  }
}
