FROM node:18.20.0-alpine

# Install PM2
RUN apk add --no-cache npm

# Install production dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD [ "node", "server.js" ]
