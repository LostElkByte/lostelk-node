import { connection } from "../app/database/mysql";
import { ColorModel } from "./color.model";

/**
* 创建颜色
*/
export const createColor = async (
  color: ColorModel
) => {
  // 准备查询
  const statement = `
  INSERT INTO color
  SET ?
`;

  // 执行查询
  const [data] = await connection.promise().query(statement, color)

  // 提供数据
  return data as any
}

/**
* 按颜色名查找颜色
*/
export const getColorByName = async (
  colorName: string
) => {
  // 准备查询
  const statement = `
    SELECT id, name FROM color
    WHERE NAME = ?
  `
  // 执行查询
  const [data] = await connection.promise().query(statement, colorName)

  // 提供数据
  return data[0]
}