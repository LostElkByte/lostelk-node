export class FileModel {
  id?: string;
  originalname: string;
  mimetype: string;
  filename: string;
  size: number;
  userId: number;
  postId?: number;
  width?: number;
  height?: number;
  metadata?: any;
  mainColor?: Array<number>;
  paletteColor?: any;
  mainColorName?: string;
  paletteColorNameList?: any;
}
