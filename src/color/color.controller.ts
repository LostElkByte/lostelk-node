import { Request, Response, NextFunction } from 'express'
import { createColor, getColorByName } from './color.service'

/**
* 创建颜色
*/
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 准备数据
  const { name } = request.body;

  try {
    // 查找颜色
    const color = await getColorByName(name)

    // 如果颜色存在就报错
    if (color) throw new Error('COLOR_ALREADY_EXISTS')

    // 存储颜色
    const data = await createColor({ name });

    // 做出响应
    response.status(201).send(data)
  } catch (error) {
    next(error)
  }
}