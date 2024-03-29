import express from 'express'
import * as userController from './user.controller'
import { validateUserData, hashPasswordAndEmail } from './user.middleware'

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
 * 导出路由
 */
export default router