FROM node:12.16.3-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

RUN mv ormconfig.deploy.js ormconfig.js

EXPOSE 3000

CMD ["yarn", "start"]
