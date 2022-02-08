FROM node:10 as build-stage

LABEL maintainer=947252044@qq.com

WORKDIR /app

COPY . .

RUN npm install --registry=https://registry.npm.taobao.org \
  && npm run build \
  && npm rebuild bcrypt --build-from-source

EXPOSE 3000 3001

VOLUME ["/app/public"]

CMD ["node", "dist/server.bundle.js"]
