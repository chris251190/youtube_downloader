const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const app = express();


app.use(express.static('public'));

app.get('/download', (req, res) => {
  const url = req.query.url;
  const starttime = req.query.starttime;
  const endtime = req.query.endtime;

  const video = ytdl(url, { quality: 'highest' });

  let filePath = path.join('/tmp', 'video.mp4');

  if (!fs.existsSync('/tmp')) {
    fs.mkdirSync('/tmp');
  }

  ffmpeg(video)
    .setStartTime(starttime)
    .setDuration(endtime - starttime)
    .format('mp4')
    .on('end', () => {
      res.download(filePath, 'video.mp4', (err) => {
        if (err) {
          console.log(err);
        } else {
          fs.unlinkSync(filePath);
        }
      });
    })
    .save(filePath);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});