import path from 'path';
import fs from 'fs';
import Jimp from 'jimp';
import ColorThief from 'colorthief';
import { connection } from '../app/database/mysql';
import { FileModel } from './file.model';
import _ from 'lodash';
import colorNamer from 'color-namer';

/**
 * 存储文件信息
 */
export const createFile = async (file: FileModel) => {
  // 准备查询
  const statement = `
    INSERT INTO file
    SET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, file);

  // 提供数据
  return data;
};

/**
 * 按 ID 查找文件
 */
export const findFileById = async (fileId: number) => {
  // 准备查询
  const statement = `
    SELECT * FROM file
    WHERE id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, fileId);

  // 提供数据
  return data[0];
};

/**
 * 添加图像尺寸
 */
export const imageResizer = async (image: Jimp, file: Express.Multer.File) => {
  // 图像尺寸
  let width: number;
  if (image['_exif']) {
    width = image['_exif'].imageSize.width;
  } else {
    width = image['bitmap'].width;
  }

  // 文件路径
  const largeFilePath = path.join(
    file.destination,
    'resized',
    `large-${file.filename}`,
  );
  const mediumFilePath = path.join(
    file.destination,
    'resized',
    `medium-${file.filename}`,
  );
  const thumbnailFilePath = path.join(
    file.destination,
    'resized',
    `thumbnail-${file.filename}`,
  );

  // 大尺寸
  if (width > 1280) {
    image
      .resize(1280, Jimp.AUTO)
      .quality(100)
      .write(`${largeFilePath}`);
  }

  // 中等尺寸
  if (width > 640) {
    image
      .resize(640, Jimp.AUTO)
      .quality(85)
      .write(`${mediumFilePath}`);
  }

  // 缩略图
  if (width > 320) {
    image
      .resize(320, Jimp.AUTO)
      .quality(20)
      .write(`${thumbnailFilePath}`);
  }
};

/**
 * 转换十六进制
 * @param r
 * @param g
 * @param b
 * @returns
 */
export const rgbToHex = (r, g, b) =>
  '#' +
  [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');

/**
 * 提取图片颜色
 */
export const extractionColor = async (
  image: Jimp,
  file: Express.Multer.File,
) => {
  // 图像尺寸
  let width: number;
  if (image['_exif']) {
    width = image['_exif'].imageSize.width;
  } else {
    width = image['bitmap'].width;
  }

  // 文件路径
  const mediumFilePath = path.join(
    file.destination,
    'resized',
    `medium-${file.filename}`,
  );

  // RGB主色
  let mainColor: any;
  // RGB调色板列表
  let paletteColor: any;

  if (width > 320) {
    // 提取图片RGB主色
    await ColorThief.getColor(mediumFilePath, 10)
      .then(color => {
        mainColor = color;
      })
      .catch(err => {
        console.log(err);
      });

    // 提取图片RGB副色
    await ColorThief.getPalette(mediumFilePath, 8)
      .then(palette => {
        paletteColor = palette;
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    // 提取图片RGB主色
    await ColorThief.getColor(file.path, 10)
      .then(color => {
        mainColor = color;
      })
      .catch(err => {
        console.log(err);
      });

    // 提取图片RGB副色
    await ColorThief.getPalette(file.path, 8)
      .then(palette => {
        paletteColor = palette;
      })
      .catch(err => {
        console.log(err);
      });
  }

  // 如果提取RGB主色失败
  if (!mainColor && paletteColor) {
    mainColor = paletteColor[0];
  }

  // 主色HEX颜色
  let mainHexColor: string;
  // 主色RBG转HEX
  mainHexColor = rgbToHex(mainColor[0], mainColor[1], mainColor[2]);
  // 主色名称的Key
  let mainColorNameKey: string;
  // 获取主色名称的key
  mainColorNameKey = colorNamer(mainHexColor, { pick: ['ntc'] }).ntc[0].name;

  // 调色板HEX颜色列表
  let paletteColornHexList = [] as Array<string>;
  // 调色板RBG转为HEX
  for (const itemColor of paletteColor) {
    // RBG转HEX
    const hexColor = rgbToHex(itemColor[0], itemColor[1], itemColor[2]);
    // PUSH进调色板HEX颜色列表
    paletteColornHexList.push(hexColor);
  }

  return {
    mainColor,
    paletteColor,
    mainColorNameKey,
    mainHexColor,
    paletteColornHexList,
  };
};

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
  const [data] = await connection.promise().query(statement, postId);

  // 提供数据
  return data as any;
};

/**
 * 删除内容文件
 */
export const deletePostFiles = async (files: Array<FileModel>) => {
  // 准备文件路径
  const uploads = 'uploads/files';
  const resized = [uploads, 'resized'];

  files.map(file => {
    const filesToDelete = [
      [uploads, file.filename],
      [...resized, `thumbnail-${file.filename}`],
      [...resized, `medium-${file.filename}`],
      [...resized, `large-${file.filename}`],
    ];

    filesToDelete.map(item => {
      const filePath = path.join(...item);

      fs.stat(filePath, (error, stats) => {
        if (stats) {
          fs.unlink(filePath, error => {
            if (error) throw error;
          });
        }
      });
    });
  });
};
