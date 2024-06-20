ARG NODE_IMAGE=node:16.13.1-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init
WORKDIR /app/storage
USER root
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

FROM dependencies AS build
RUN node ace build --production

FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /app/storage/build .
EXPOSE $PORT

# Install PM2 globally
RUN npm install pm2 -g

# Start the application with PM2
CMD ["dumb-init", "pm2-runtime", "start", "server.js"]
