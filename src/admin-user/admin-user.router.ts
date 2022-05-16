import express from 'express'
import { authGuard } from '../auth/auth.middleware'
import { hashPasswordAndEmail } from '../user/user.middleware'
import * as adminUserController from './admin-user.controller'
import { validateAdminUserData } from './admin-user.middleware'

const router = express.Router()

/**
 * 创建管理员
 */
router.post('/admin-users', authGuard, validateAdminUserData, hashPasswordAndEmail, adminUserController.store)

/**
 * 导出路由
 */
export default router