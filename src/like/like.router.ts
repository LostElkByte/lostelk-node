import express from 'express'
import { deflate } from 'zlib'
import * as likeController from './like.controller'

const router = express.Router()

/**
 * 导出路由
 */
export default router