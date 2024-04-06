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
      .save(filePath);
  });
  
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});