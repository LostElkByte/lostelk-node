# lostElk 服务端应用

## 启动应用

```
npm run server:dev
```

## 生成秘钥与公钥

### 创建存放秘钥与公钥的目录

```
mkdir config
```

### 进入目录

```
cd config
```

### 进入 OpenSSL 安全协议命令面板

```
openssl
```

### 生成秘钥文件

```
genrsa -out private.key 4096
```

### 生成公钥文件

```
rsa -in private.key -pubout -out public.key
```

### 退出

```
exit
```
