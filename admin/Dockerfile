# build stage
FROM node:10 as build-stage

LABEL maintainer=947252044@qq.com

# 创建一个工作目录
WORKDIR /app

COPY . .

RUN npm install cnpm -g --no-progress --registry=https://registry.npm.taobao.org

RUN cnpm install --no-progress

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 8888

CMD ["nginx", "-g", "daemon off;"]
