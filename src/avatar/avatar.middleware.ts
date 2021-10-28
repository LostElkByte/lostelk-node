import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { fileFilter } from '../file/file.middleware'

/**
 * 文件过滤器
 */
const avatarUploadFiler = fileFilter(['image/png', 'image/jpg', 'image/jpeg'])

/**
 * 创建一个 Multer
 */
const avatarUpload = multer({
  dest: 'uploads/avatar',
  fileFilter: avatarUploadFiler
})

/**
 * 文件拦截器
 */
export const avatarInterceptor = avatarUpload.single('avatar')