const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg'); // Modul untuk menggunakan FFmpeg

const app = express();

// Sertifikat SSL untuk HTTPS
const privateKey = fs.readFileSync('ssl/private.key', 'utf8');
const certificate = fs.readFileSync('ssl/certificate.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// API untuk mengeluarkan video
app.get('/video', (req, res) => {
  const videoPath = path.join(__dirname, 'videos', 'vidio.mp4'); // Ganti dengan path video Anda

  // Set header untuk streaming video
  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Accept-Ranges', 'bytes');

  const videoStream = fs.createReadStream(videoPath);
  
  // Tentukan durasi video dan kirimkan potongan video ke klien
  ffmpeg(videoStream)
    .format('mp4')
    .on('start', function(commandLine) {
      console.log('FFmpeg process started: ' + commandLine);
    })
    .on('end', function() {
      console.log('FFmpeg process finished.');
    })
    .on('error', function(err) {
      console.error('FFmpeg error: ' + err.message);
      res.status(500).send('Video streaming failed');
    })
    .pipe(res, { end: true });
});

// Menjalankan server HTTPS
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(3000, () => {
  console.log('HTTPS Server running on https://localhost:3000');
});
