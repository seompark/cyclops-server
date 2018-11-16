FROM node:10

ENV APP=/app/cyclops
RUN mkdir -p $APP
WORKDIR $APP

RUN yarn global add pm2@3

COPY package.json $APP/package.json
COPY yarn.lock $APP/yarn.lock
RUN yarn install

COPY . $APP

EXPOSE $PORT
CMD ["yarn", "start:docker"]