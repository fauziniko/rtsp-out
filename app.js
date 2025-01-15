const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg'); // Modul untuk menggunakan FFmpeg

const app = express();

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

// Menjalankan server HTTP
const httpServer = http.createServer(app);

httpServer.listen(3000, () => {
  console.log('HTTP Server running on http://localhost:3000');
});
