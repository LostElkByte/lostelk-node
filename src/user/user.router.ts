import express from 'express'
import * as userController from './user.controller'
import { validateUserData, hashPasswordAndEmail, validateUpdateUserData, emailWhetherRegistered } from './user.middleware'
import { authGuard } from '../auth/auth.middleware'

const router = express.Router()

/**
 * 创建用户
 */
router.post('/users', validateUserData, hashPasswordAndEmail, userController.store)

/**
 * 注册 - 激活邮箱
 */
router.get('/activat_email', userController.emailVerify)

/**
 * 用户账户
 */
router.get('/users/:userId', userController.show)

/**
 * 更新用户 - 用户名/密码/个人简介
 */
router.patch('/users', authGuard, validateUpdateUserData, userController.update)

/**
 * 找回密码 - 发送邮件
 */
router.post('/send_retrieve_password_verify_key', emailWhetherRegistered, userController.sendRetrievePasswordVerifyKey)

/**
 * 找回密码 - 修改密码
 */
router.patch('/retrieve_password', userController.retrievePasswordPatch)

/**
 * 导出路由
 */
export default router