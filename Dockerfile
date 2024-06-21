FROM node:18.20.0-alpine

WORKDIR /

COPY package*.json ./
COPY . .

RUN npm ci --omit=dev

RUN npm run build

ENV PORT=$PORT
EXPOSE $PORT

RUN npm install pm2 -g

CMD [ "pm2-runtime", "start", "server.js" ]