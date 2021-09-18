import express from 'express'
import { authGuard } from '../auth/auth.middleware';
import * as commentController from './comment.controller'

const router = express.Router()

/**
 * 发表评论
 */
router.post('/comments', authGuard, commentController.store)
/**
 * 导出路由
 */
export default router;