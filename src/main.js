const { response, request } = require('express');
const express = require('express')
const app = express();
const port = 3000;

/**
 * 使用json中间件
 */
app.use(express.json());

app.listen(port, () => {
  console.log('🚀 服务已启动!');
})

app.get('/', (request, response) => {
  response.send('你好');
});

const data = [
  {
    id: 1,
    title: '关山月',
    content: '明月出天山,苍茫云海间'
  },
  {
    id: 2,
    title: '关山月1',
    content: '明月出天山,苍茫云海间1'
  }
]

app.get('/posts', (request, response) => {
  response.send(data)
})

app.get('/posts/:postId', (request, response) => {
  const { postId } = request.params;

  const posts = data.filter(item => item.id == postId)

  response.send(posts[0])
})

/**
 * 创建内容
 */
app.post('/posts', (request, response) => {
  // 获取请求里的数据
  const { content } = request.body;

  // 设置响应状态码
  response.status(201);

  // 做出响应
  response.send({
    message: `成功创建了内容: ${content}`
  })
})