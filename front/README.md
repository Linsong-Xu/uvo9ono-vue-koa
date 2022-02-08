# 前端项目



## 更改后台访问配置

```shell
vi ./src/config/index.js
```

```javascript
export default {
  baseUrl: {
    dev: 'http://47.92.53.190:3000',
    pro: 'http://47.92.53.190:3000'
  },
  publicPath: [/^\/public/, /^\/login/]
}
```

## 更改WebSocket访问配置

```shell
vi ./utils/websocket.js
```

```javascript
const defautConfig = {
      url: '47.92.53.190',
      port: '3001',
      protocol: 'ws',
      timeInterval: 5 * 1000
    }
```



## 使用Dockerfile构建

```shell
# build
docker build -t web:1.0 .

# run
docker run -itd --name web -p 80:80 web:1.0
```

