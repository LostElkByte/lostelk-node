import express from 'express'
import { POSTS_PER_PAGE } from '../app/app.config'
import { paginate } from '../post/post.middleware'
import { filter } from '../post/post.middleware'
import * as searchController from './search.controller'

const router = express.Router()

/**
 * 搜索标签
 */
router.get('/search/tags', searchController.tags)

/**
 * 搜索颜色
 */
router.get('/search/colors', searchController.colors)

/**
 * 搜索用户
 */
router.get('/search/users', paginate(POSTS_PER_PAGE), searchController.users)

/**
 * 搜索相机
 */
router.get('/search/cameras', searchController.cameras)

/**
 * 搜索镜头
 */
router.get('/search/lens', searchController.lens)

/**
 * 搜索帖子总数
 */
router.get('/search/Total', filter, searchController.searchTotal)

/**
 * 搜索用户总数
 */
router.get('/search/user/Total', searchController.searchUserTotalByName)

/**
 * 默认导出
 */
export default router