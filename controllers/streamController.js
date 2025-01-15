const { spawn } = require('child_process');
const { rtspServerUrl, videoFilePath } = require('../config/rtspConfig');

let ffmpegProcess = null;

exports.startStream = (req, res) => {
  if (ffmpegProcess) {
    return res.status(400).send('Stream is already running.');
  }

  ffmpegProcess = spawn('ffmpeg', [
    '-re',
    '-i', videoFilePath,
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-f', 'rtsp',
    rtspServerUrl,
  ]);

  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
    ffmpegProcess = null;
  });

  res.send('RTSP stream started.');
};

exports.stopStream = (req, res) => {
  if (!ffmpegProcess) {
    return res.status(400).send('No active stream to stop.');
  }

  ffmpegProcess.kill('SIGINT');
  ffmpegProcess = null;
  res.send('RTSP stream stopped.');
};
