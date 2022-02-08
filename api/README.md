# 后台API



## 更改后台相应配置

```shell
vi ./src/config/index.js
```

**需要注意的是如果是在本地做实验，下面文件中的ip不能是127.0.0.1，因为api服务是部署在容器中的，127.0.0.1在这里并不是指本地宿主机，而是指容器自己，所以想要连接本地宿主机的话，ip应该写成host.docker.internal**

```javascript
import path from 'path'

const DB_URL = 'mongodb://test:123456@47.92.53.190:27017/testdb'
const REDIS = {
  host: '47.92.53.190',
  port: 15001,
  password: '123456'
}
const JWT_SECRET = 'a&*38QthAKuiRwISGLotgq^3%^$zvA3A6Hfr8MF$jM*HY4*dWcwAW&9NGp7*b53!'

const baseUrl = process.env.NODE_ENV === 'production' ? 'http://47.92.53.190' : 'http://47.92.53.190'

const uploadPath = process.env.NODE_ENV === 'production' ? '/app/public' : path.join(path.resolve(__dirname), '../../public')

const adminEmail = ['947252044@qq.com']

const publicPath = [/^\/public/, /^\/login/, /^\/content/, /^\/user/, /^\/comments/]

const isDevMode = process.env.NODE_ENV !== 'production'

const port = isDevMode ? 3000 : 3000

const wsPort = isDevMode ? 3001 : 3001

export default {
  DB_URL,
  REDIS,
  JWT_SECRET,
  baseUrl,
  uploadPath,
  adminEmail,
  publicPath,
  isDevMode,
  port,
  wsPort
}
```

```shell
vi ./src/config/MailConfig.js
```

## 使用Dockerfile构建

```
# build
docker build -t api:1.0 .

# run
docker run -itd --name api -p 3000:3000 -p 3001:3001 api:1.0
```

