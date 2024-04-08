const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/videoInfo', async (req, res) => {
  const videoId = req.query.videoId;
  const start = "60"; // Startzeit in Sekunden, z.B. "60" für 1 Minute
  const end = "150"; // Endzeit in Sekunden, z.B. "150" für 2:30 Minuten

  if (!videoId || !start || !end) {
    return res.status(400).send('Parameter fehlen');
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  if (!ytdl.validateURL(videoUrl)) {
    return res.status(400).send('Ungültige Video-URL');
  }

  const tempFilePath = path.join(__dirname, `temp_${videoId}.mp4`);
  const duration = parseInt(end, 10) - parseInt(start, 10);

  ffmpeg(ytdl(videoUrl, { quality: 'highestvideo', filter: 'audioandvideo'}))
    .setStartTime(start)
    .duration(duration)
    .output(tempFilePath)
    .on('end', () => {
      res.sendFile(tempFilePath, (err) => {
        if (err) {
          console.error('Fehler beim Senden der Datei: ', err);
          return;
        }
        fs.unlink(tempFilePath, (deleteErr) => {
          if (deleteErr) {
            console.error('Fehler beim Löschen der temporären Datei: ', deleteErr);
          }
        });
      });
    })
    .on('error', (err) => {
      console.error('Fehler beim Verarbeiten des Videos: ', err);
      res.status(500).send('Serverfehler beim Verarbeiten des Videos');
    })
    .run();
});

const port = 3000;
app.listen(port, () => {
  console.log(`App läuft auf http://localhost:${port}`);
});