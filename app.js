const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

app.use(express.static('public'));

app.get('/simple', (req, res) => {
  res.send('This is a simple string');
});

app.get('/download', (req, res) => {
    console.log("Trying to download");
    const url = req.query.url;
    const starttime = req.query.starttime;
    const endtime = req.query.endtime;
  
    console.log('Received download request for URL:', url);
    console.log('Start time:', starttime);
    console.log('End time:', endtime);
  
    const video = ytdl(url, { quality: 'highest' });
  
    let filePath = path.join('/tmp', 'video.mp4');
  
    if (!fs.existsSync('/tmp')) {
      fs.mkdirSync('/tmp');
    }
  
    console.log('Starting video processing...');
  
    ffmpeg(video)
      .setStartTime(starttime)
      .setDuration(endtime - starttime)
      .format('mp4')
      .on('end', () => {
        console.log('Video processing complete.');
        res.download(filePath, 'video.mp4', (err) => {
          if (err) {
            console.log('Error while sending file:', err);
          } else {
            console.log('File sent successfully.');
            fs.unlinkSync(filePath);
          }
        });
      })
      .on('error', (err) => {
        console.log('Error while processing video:', err);
      })
      .save(filePath);
  });
  
app.listen(port, () => {
  console.log('Server is running on port 3000');
});