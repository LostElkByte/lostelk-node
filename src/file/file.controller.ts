import path from 'path'
import fs from 'fs'
import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'
import { createFile, findFileById } from './file.service'
import { ColorModel } from '../color/color.model'
import { createPostColor, postHasColor } from '../post/post.service'
import { getColorByName, createColor } from '../color/color.service'
import colorNameTranslateChinese from '../color/colorNameTranslateChinese'

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

  // // 调色板中文颜色名集合
  // let chineseColorNameList = [] as Array<string>

  // // 调色板W3C颜色名列表
  // const paletteColorNameList = request.fileMetaData.paletteColorNameList

  // for (const itemColorName of paletteColorNameList) {
  //   // W3C颜色名转中文颜色
  //   const chinesecolorName = colorNameTranslateChinese(itemColorName) as Array<string>
  //   chineseColorNameList = [...chineseColorNameList, ...chinesecolorName]
  // }

  // // 调色板中文颜色名集合去重
  // chineseColorNameList = Array.from(new Set(chineseColorNameList))

  // 主色W3C颜色名
  const mainColorName = request.fileMetaData.mainColor

  // W3C颜色名转中文颜色
  const chineseColorNameList = colorNameTranslateChinese(mainColorName) as Array<string>

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
      width: request.fileMetaData.width,
      height: request.fileMetaData.height,
      metadata: request.fileMetaData.metadata,
      mainColor: request.fileMetaData.mainColor,
      paletteColor: request.fileMetaData.paletteColor
    })

    // 做出响应
    response.status(201).send(data)
  } catch (error) {
    next(error)
  }

  // 储存颜色标签
  for (const colorItem of chineseColorNameList) {
    let color: ColorModel
    // 查找颜色标签
    try {
      color = await getColorByName(colorItem)
    } catch (error) {
      return next(error)
    }

    // 没找到颜色标签,创建这个颜色标签
    if (!color) {
      try {
        const data = await createColor({ name: colorItem })
        color = { id: data.insertId }
      } catch (error) {
        return next(error)
      }
    }

    // 给内容打上颜色标签
    try {
      await createPostColor(postId, color.id)
    } catch (error) {
      return next(error)
    }
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
    const data = _.pick(file, ['id', 'isze', 'width', 'height', 'metadata', 'mainColor', 'paletteColor'])

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
