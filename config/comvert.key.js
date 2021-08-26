const fs = require('fs')
const path = require('path')

/**
 * 读取秘钥文件
 */
const privateKey = fs.readFileSync(path.join('config', 'private.key'))
const publicKey = fs.readFileSync(path.join('config', 'public.key'))

/**
 * 转换成Base64 格式
 */
const privateKeyBase64 = Buffer.from(privateKey).toString('base64')
const publicKeyBase64 = Buffer.from(publicKey).toString('base64')
const aaa = Buffer.from(privateKey)
/**
 * 输出转换结果
 */
console.log('\nPrivate Key:')
console.log(privateKeyBase64)
console.log('\public Key:')
console.log(publicKeyBase64)
