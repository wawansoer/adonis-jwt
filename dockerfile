ARG NODE_IMAGE=node:16.13.1-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init
RUN mkdir -p /data/coolify/applications/cocg8s0/app && chown root:Puan#27Rd /data/coolify/applications/cocg8s0/app
WORKDIR /data/coolify/applications/cocg8s0/app
USER root
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=root:Puan#27Rd . .

FROM dependencies AS build
RUN node ace build --production

FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=root:Puan#27Rd ./package*.json ./
RUN npm ci --production
COPY --chown=root:Puan#27Rd --from=build /data/coolify/applications/cocg8s0/app/build .
EXPOSE $PORT

# Install PM2 globally
RUN npm install pm2 -g

# Start the application with PM2
CMD ["dumb-init", "pm2-runtime", "start", "server.js"]
