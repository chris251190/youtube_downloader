const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

app.use(express.static('public'));

app.get('/videoInfo', async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) {
    return res.status(400).send('Keine Video-ID angegeben');
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  if (!ytdl.validateURL(videoUrl)) {
    return res.status(400).send('Ungültige Video-URL');
  }

  try {
    // Holen Sie die Videoinformationen
    const info = await ytdl.getInfo(videoUrl);
    // Finden Sie den besten Stream mit Audio und Video
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
    if (format.url) {
      // Senden Sie die URL des Formats an den Client
      res.json({ downloadUrl: format.url });
    } else {
      res.status(404).send('Kein passendes Videoformat gefunden');
    }
  } catch (err) {
    console.error('Fehler beim Abrufen der Videoinformationen: ', err);
    res.status(500).send('Serverfehler beim Abrufen der Videoinformationen');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`App läuft auf http://localhost:${port}`);
});