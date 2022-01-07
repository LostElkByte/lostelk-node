import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { sendRegisterEmail, sendActivateSuccess, sendRetrievePasswordEmail } from '../app/nodemailer'
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
    const registration_verify_key = uuidv4();

    // 存储邮箱验证码
    await userService.setEmailVerifyKey(email, registration_verify_key)

    // 发送校验邮箱
    sendRegisterEmail({ name, email, registration_verify_key });

    response.status(201).send({ isSucceed: 1, message: '注册成功! 激活链接已发送到您的邮箱,请在注册起30分钟内进行激活' })
  } catch (error) {
    next(error)
  }
}

/**
 * 注册 - 邮箱校验
 */
export const emailVerify = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { email, name, registration_verify_key } = request.query
  const create_time = dayjs().unix()

  // 通过邮箱查询校验码
  const data = await userService.getVerift_key(email as string)

  try {
    if (data.registration_verify_key === registration_verify_key && create_time - data.create_time <= 1800) {
      userService.updateUserStatus(email as string, 1)
      userService.deleteVerift_key(email as string)
      sendActivateSuccess({ name, email })
      response.status(201).send({ isSucceed: 1, message: `您的账户: ${email} 激活成功` })
      return
    }

    if (data.registration_verify_key === registration_verify_key && create_time - data.create_time > 1800) {
      response.status(409).send({ isSucceed: 0, message: '此激活链接已过期, 请重新注册' })
      return
    }

    if (data.registration_verify_key != registration_verify_key) {
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

/**
* 更新用户
*/
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { id } = request.user
  const userData = _.pick(request.body.update, ['name', 'password'])

  // 更新用户
  try {
    const data = await userService.updateUser(id, userData)

    // 做出响应
    response.send(data)
  } catch (error) {
    next(error)
  }
}

/**
 * 找回密码 - 发送邮箱验证码
 */
export const sendRetrievePasswordVerifyKey = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { email } = request.body

  // 创建用户
  try {
    // 生成当前时间戳
    const launch_retrieval_password_time = dayjs().unix()

    // 生成找回密码验证码
    const retrieve_password_verify_key = uuidv4().slice(0, 6);

    // 存储生成找回密码验证码与当前时间戳
    await userService.setRetrievePasswordVerifyKey(email, retrieve_password_verify_key, launch_retrieval_password_time)

    // 发送校验邮箱
    sendRetrievePasswordEmail({ email, retrieve_password_verify_key });

    response.status(201).send({ isSucceed: 1, message: '验证码已发送到您的邮箱,请注意查收' })
  } catch (error) {
    next(error)
  }
}