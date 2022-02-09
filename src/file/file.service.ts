import path from 'path'
import fs from 'fs'
import Jimp from 'jimp'
import { connection } from '../app/database/mysql'
import { FileModel } from './file.model'
import { start } from 'repl'

/**
* 存储文件信息
*/
export const createFile = async (
  file: FileModel
) => {
  // 准备查询
  const statement = `
    INSERT INTO file
    SET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, file)

  // 提供数据
  return data;
}

/**
 * 按 ID 查找文件
 */
export const findFileById = async (
  fileId: number
) => {
  // 准备查询
  const statement = `
    SELECT * FROM file
    WHERE id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, fileId)

  // 提供数据
  return data[0]
}

/**
* 添加图像尺寸
*/
export const imageResizer = async (
  image: Jimp, file: Express.Multer.File
) => {
  // 图像尺寸
  let width: number
  if (image['_exif']) {
    width = image['_exif'].imageSize.width
  } else {
    width = image['bitmap'].width
  }

  // 文件路径
  const filePath = path.join(file.destination, 'resized', file.filename)

  // 大尺寸
  if (width > 1280) {
    image
      .resize(1280, Jimp.AUTO)
      .quality(100)
      .write(`${filePath}-large`)
  }

  // 中等尺寸
  if (width > 640) {
    image
      .resize(640, Jimp.AUTO)
      .quality(85)
      .write(`${filePath}-medium`)
  }

  // 缩略图
  if (width > 320) {
    image
      .resize(320, Jimp.AUTO)
      .quality(20)
      .write(`${filePath}-thumbnail`)
  }
}

/**
 * 找出内容相关文件
 */
export const getPostFiles = async (postId: number) => {
  const statement = `
    SELECT
      file.filename
    FROM
      file
    WHERE
      postId = ?
  `;

  // 执行
  const [data] = await connection.promise().query(statement, postId)

  // 提供数据
  return data as any
}

/**
 * 删除内容文件
 */
export const deletePostFiles = async (files: Array<FileModel>) => {
  // 准备文件路径
  const uploads = 'uploads/files'
  const resized = [uploads, 'resized']

  files.map(file => {
    const filesToDelete = [
      [uploads, file.filename],
      [...resized, `${file.filename}-thumbnail`],
      [...resized, `${file.filename}-medium`],
      [...resized, `${file.filename}-large`],
    ]

    filesToDelete.map(item => {
      const filePath = path.join(...item)

      fs.stat(filePath, (error, stats) => {
        if (stats) {
          fs.unlink(filePath, error => {
            if (error) throw error
          })
        }
      })
    })
  })


}
