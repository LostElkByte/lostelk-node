import express from 'express'
import { authGuard } from '../auth/auth.middleware'
import * as adminAuthController from './admin-auth.controller'
import { backgroundManagementAccessControl, validateLoginData } from './admin-auth.middleware'

const router = express.Router()

/**
 * 管理员用户登录
 */
router.post('/admin-login', validateLoginData, adminAuthController.login)

/**
 * 角色分配
 */
router.post('/assign-roles', authGuard, backgroundManagementAccessControl({ needPossession: true, jurisdictionId: 1, }), adminAuthController.assignRoles)

/**
 * 权限分配
 */
router.post('/assign-jurisdiction', authGuard, backgroundManagementAccessControl({ needPossession: true, jurisdictionId: 9 }), adminAuthController.assignJurisdiction)

/**
 * 查询用户角色
 */
router.get('/select-user-roles/:userId', adminAuthController.selectUserRole)

/**
 * 查询角色权限
 */
router.get('/select-roles-jurisdiction/:roleId', adminAuthController.selectRoleJurisdiction)

/**
 * 查询所有角色
 */
router.get('/select-all-roles', adminAuthController.selectRole)

/**
 * 查询所有权限
 */
router.get('/select-all-jurisdiction', adminAuthController.selectJurisdiction)

/**
 * 查询当前用户权限
 */
router.get('/select-user-jurisdiction', authGuard, backgroundManagementAccessControl({ needPossession: false }), adminAuthController.selectUserJurisdiction)

/**
 * 导出路由
 */
export default router