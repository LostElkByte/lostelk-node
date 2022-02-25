import express from 'express'
import * as searchController from './search.controller'

const router = express.Router()

/**
 * 搜索标签
 */
router.get('/search/tags', searchController.tags)

/**
 * 搜索用户
 */
router.get('/search/users', searchController.users)

/**
 * 搜索相机
 */
router.get('/search/cameras', searchController.cameras)

/**
 * 默认导出
 */
export default router