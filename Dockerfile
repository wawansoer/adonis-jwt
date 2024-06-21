FROM node:18.20.0-alpine

WORKDIR /

COPY package*.json ./
COPY . .

RUN npm ci --omit=dev

FROM dependencies AS build
RUN node ace build --production

ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0

RUN npm ci --omit=dev

ENV PORT=$PORT
EXPOSE $PORT

RUN npm install pm2 -g

CMD [ "pm2-runtime", "start", "server.js" ]