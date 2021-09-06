import { Request, Response, NextFunction } from 'express'
import multer from 'multer'

/**
 * 创建一个Multer
 */
const fileUpload = multer({
  dest: 'uploads/'
})

/**
 * 文件拦截器
 */
export const fileInterceptor = fileUpload.single('file')