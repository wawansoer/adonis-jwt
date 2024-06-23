# Menggunakan node image sebagai base image
FROM node:16.17.0-alpine

# Menentukan working directory di dalam container
WORKDIR /app

# Menyalin file package.json dan package-lock.json ke working directory
COPY package*.json ./

# Menginstall dependencies
RUN npm install

# Menyalin semua file dari project ke working directory
COPY . .

# Membangun aplikasi AdonisJS
RUN npm run build

# Menexpose port yang digunakan oleh aplikasi AdonisJS (default 3333)
EXPOSE 4444

# Menjalankan aplikasi AdonisJS
CMD ["node", "/app/build/server.js"]

