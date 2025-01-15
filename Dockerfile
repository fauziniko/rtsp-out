# Menggunakan Node.js sebagai base image
FROM node:16

# Menambahkan dependencies untuk menginstal FFmpeg
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Menentukan working directory di dalam container
WORKDIR /usr/src/app

# Menyalin package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Menginstal dependensi aplikasi Node.js termasuk fluent-ffmpeg
RUN npm install

# Menyalin seluruh kode aplikasi ke dalam container
COPY . .

# Mengekspos port untuk aplikasi dan RTSP stream
EXPOSE 3000 8554

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]
