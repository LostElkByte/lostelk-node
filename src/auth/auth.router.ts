import express from 'express'
import * as authController from './auth.controller'
import { authGuard, validateLoginData } from './auth.middleware'

const router = express.Router()

/**
 * 用户登录
 */
router.post('/login', validateLoginData, authController.login)

/**
 * 定义验证登录接口
 */
router.post('/auth/validate', authGuard, authController.validate)

/**
 * 导出路由
 */
export default router