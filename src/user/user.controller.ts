import { Request, Response, NextFunction } from 'express'
import { UserModel } from './user.model'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { sendRegisterEmail, sendActivateSuccess } from '../app/nodemailer'
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

    response.status(201).send({ isSucceed: 1, message: '注册成功! 激活链接已发送到您的邮箱,请在注册起30分钟内进行激活' })
  } catch (error) {
    next(error)
  }
}

/**
 * 邮箱校验
 */
export const emailVerify = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { email, name, verify_key } = request.query
  const create_time = dayjs().unix()

  // 通过邮箱查询校验码
  const data = await userService.getVerift_key(email as string)

  try {
    if (data.verify_key === verify_key && create_time - data.create_time <= 1800) {
      userService.updateUserStatus(email as string, 1)
      userService.deleteVerift_key(email as string)
      sendActivateSuccess({ name, email })
      response.status(201).send({ isSucceed: 1, message: `您的账户: ${email} 激活成功` })
      return
    }

    if (data.verify_key === verify_key && create_time - data.create_time > 1800) {
      response.status(409).send({ isSucceed: 0, message: '此激活链接已过期, 请重新注册' })
      return
    }

    if (data.verify_key != verify_key) {
      response.status(409).send({ isSucceed: 0, message: '此激活链接校验失败' })
      return
    }

  } catch (error) {
    next(error)
  }

}

/**
* 用户账户
*/
export const show = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { userId } = request.params

  // 调取用户
  try {
    const user = await userService.getUserById(parseInt(userId, 10))

    if (!user) {
      return next(new Error('USER_NOT_FOUND'))
    }

    // 做出响应
    response.send(user)
  } catch (error) {
    next(error)
  }
}