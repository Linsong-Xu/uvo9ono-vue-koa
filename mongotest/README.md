## MongoDB初始化配置

```shell
# 进入mongo命令环境
docker exec -it mongotest-mongo-1 mongo

# 初始化配置
# 管理员登陆
> use admin
> db.auth('root', 'example')
> show dbs

# 创建数据库
> use testdb

# 创建用户
> db.createUser({user:'test',pwd:'123456',roles:[{role:'dbOwner', db:'testdb'}]})

# 测试登陆
> use testdb
> db.auth('test', '123456')
```

## MongoDB数据恢复

### 首先先将数据备份复制到容器内部
```shell
docker cp dbdump.zip  mongotest-mongo-1:/
```
### 然后进入容器内部将其解压缩
```shell script
docker exec -it mongotest-mongo-1
unzip dbdump.zip
```
### 然后恢复数据
```shell
docker exec -it mongotest-mongo-1 mongorestore -h localhost -u root -p example --dir ./dbdump
```
