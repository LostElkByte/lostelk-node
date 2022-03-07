import { TokenPayload } from '../src/auth/auth.interface'
import { GetPostsOptionsFilter, GetPostsOptionsPagination } from '../src/post/post.service'

declare global {
  namespace Express {
    export interface Request {
      user: TokenPayload
      fileMetaData: {
        width?: number; height?: number; metadata?: {}, mainColor?: any, paletteColor?: any, mainColorName?: string, paletteColorNameList?: Array<string>
      }
      sort: string
      filter: GetPostsOptionsFilter
      pagination: GetPostsOptionsPagination
    }
  }
}