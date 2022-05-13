import express from 'express'
import { authGuard } from '../auth/auth.middleware'
import * as adminAuthController from './admin-auth.controller'
import { accessControl, validateLoginData } from './admin-auth.middleware'

const router = express.Router()

/**
 * 管理员用户登录
 */
router.post('/admin-login', validateLoginData, adminAuthController.login)

/**
 * 角色分配
 */
router.post('/assign-roles', authGuard, accessControl({ possession: true }), adminAuthController.assignRoles)

/**
 * 权限分配
 */
router.post('/assign-jurisdiction', authGuard, accessControl({ possession: true }), adminAuthController.assignJurisdiction)

/**
 * 导出路由
 */
export default router