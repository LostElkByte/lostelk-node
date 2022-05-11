import express from 'express'
import * as adminAuthController from './admin-auth.controller'
import { validateLoginData } from './admin-auth.middleware'

const router = express.Router()

/**
 * 管理员用户登录
 */
router.post('/admin-login', validateLoginData, adminAuthController.login)

/**
 * 导出路由
 */
export default router