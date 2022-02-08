FROM node:10 as build-stage

LABEL maintainer=947252044@qq.com

WORKDIR /app

COPY . .

RUN yarn install --registry=https://registry.npm.taobao.org

RUN npm run build

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
