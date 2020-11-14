FROM node:12.16.3-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn --production

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
