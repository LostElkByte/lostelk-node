import express from 'express'
import * as colorController from './color.controller'
import { authGuard } from '../auth/auth.middleware'

const router = express.Router()

/**
 * 创建颜色
 */
router.post('/color', authGuard, colorController.store)

/**
 * 导出路由
 */
export default router