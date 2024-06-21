FROM node:18.20.0-alpine

WORKDIR /

COPY package*.json ./
COPY . .

RUN npm ci --omit=dev
RUN npm run build

EXPOSE $PORT

CMD [ "dumb-init", "node", "server.js" ]