const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

app.use(express.static('public'));


app.get('/download', (req, res) => {
  const url = req.query.url;
  res.header('Content-Disposition', `attachment; filename="video.mp4"`);
  ytdl(url, { format: 'mp4' }).pipe(res);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});