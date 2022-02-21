import { Request, Response, NextFunction } from 'express'
import multer, { FileFilterCallback } from 'multer'
import ColorThief from 'colorthief'
import Jimp from 'jimp'
import path, { resolve } from 'path'
import { findFileById, imageResizer } from './file.service'


/**
 * 文件过滤器
 */
export const fileFilter = (fileTypes: Array<string>) => {
  return (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => {
    // 测试文件类型
    const allowed = fileTypes.some(type => type === file.mimetype)

    if (allowed) {
      // 允许上传
      callback(null, true)
    } else {
      // 拒绝上传
      callback(new Error('FILE_TYPE_NOT_ACCEPT'))
    }
  }
}

const fileUploadFilter = fileFilter(['image/png', 'image/jpg', 'image/jpeg'])

/**
 * 创建一个Multer
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/files')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})
const fileUpload = multer({ storage: storage, fileFilter: fileUploadFilter })
// const fileUpload1 = multer({
//   dest: 'uploads/files',
//   fileFilter: fileUploadFilter
// })

/**
 * 文件拦截器
 */
export const fileInterceptor = fileUpload.single('file')

/**
* 文件处理器
*/
export const fileProcessor = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 文件路径
  const { path } = request.file

  let image: Jimp;

  // 提取图片主色
  let mainColor: any
  let paletteColor: any
  ColorThief.getColor(path)
    .then(color => { mainColor = color })
    .catch(err => { console.log(err) })
  // 提取图片副色
  ColorThief.getPalette(path, 5)
    .then(palette => { paletteColor = palette })
    .catch(err => { console.log(err) })

  try {
    // 读取图像文件
    image = await Jimp.read(path)
  } catch (error) {
    return next(error)
  }

  if (image['_exif']) {
    // 准备文件数据
    const { imageSize, tags } = image['_exif']

    // 在请求中添加文件数据
    request.fileMetaData = {
      width: imageSize.width,
      height: imageSize.height,
      metadata: JSON.stringify(tags),
      mainColor: JSON.stringify(mainColor),
      paletteColor: JSON.stringify(paletteColor)
    }
  } else {
    // 准备文件数据
    const { width, height } = image['bitmap']

    // 在请求中添加文件数据
    request.fileMetaData = {
      width: width,
      height: height,
      metadata: JSON.stringify({}),
      mainColor: JSON.stringify(mainColor),
      paletteColor: JSON.stringify(paletteColor)
    }
  }

  // 调整图像尺寸
  imageResizer(image, request.file)

  // 下一步
  next();
}

/**
 * 文件下载守卫
 */
export const fileDownloadGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    query: { token, socketId },
    params: { fileId },
  } = request;

  try {

    // 检查资源是否匹配
    const file = await findFileById(parseInt(fileId, 10));

    // 设置请求
    request.body = { file };
  } catch (error) {
    return next(error);
  }

  // 下一步
  next();
};