import path from 'path'
import fs from 'fs'
import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'
import { createFile, findFileById } from './file.service'

/**
* 上传文件
*/
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 当前用户
  const { id: userId } = request.user

  // 所属内容
  const postId = parseInt(request.query.post as string, 10)

  // 文件信息
  const fileInfo = _.pick(request.file, [
    'originalname',
    'mimetype',
    'filename',
    'size'
  ])

  try {
    // 保存文件信息
    const data = await createFile({
      ...fileInfo,
      userId,
      postId,
      ...request.fileMetaData
    })

    // 做出响应
    response.status(201).send(data)
  } catch (error) {
    next(error)
  }
}

/**
* 文件服务
*/
export const serve = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 从地址参数里得到文件 ID
  const { fileId } = request.params

  // 要提供的图像尺寸
  const { size } = request.query

  try {
    // 查找文件信息
    const file = await findFileById(parseInt(fileId, 10))

    // 文件名与目录
    let filename = file.filename
    let root = 'uploads/files'
    let resized = 'resized'

    if (size) {
      // 可用的图像尺寸
      const imageSizes = ['large', 'medium', 'thumbnail']

      // 检查文件尺寸是否可用
      if (!imageSizes.some(item => item == size)) {
        throw new Error('FILE_NOT_FOUND')
      }

      // 检查文件是否存在
      const fileExist = fs.existsSync(
        path.join(root, resized, `${size}-${filename}`)
      )

      // 设置文件名与目录
      if (fileExist) {
        filename = `${size}-${filename}`
        root = path.join(root, resized)
      }
    }

    // 做出响应
    response.sendFile(filename, {
      root,
      headers: {
        'Content-Type': file.mimetype
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
* 文件信息
*/
export const metadata = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 文件 ID
  const { fileId } = request.params;

  try {
    // 查询文件数据
    const file = await findFileById(parseInt(fileId, 10))

    // 准备相应数据
    const data = _.pick(file, ['id', 'isze', 'width', 'height', 'metadata'])

    // 做出响应
    response.send(data)
  } catch (error) {
    next(error)
  }
}

/**
 * 文件下载
 */
export const download = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    body: { file },
  } = request;

  try {
    const filePath = path.join('uploads/files', file.filename);

    // 设置头部
    response.header({
      'Content-Type': `${file.mimetype}`,
    });

    // 做出响应
    response.download(filePath, file.originalname);
  } catch (error) {
    next(error);
  }
};
