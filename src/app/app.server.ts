import http from 'http'
import app from './index'

/**
 * HTTP 服务器
 */
const httpServer = http.createServer(app)

/**
 * 默认导出
 */
export default httpServer