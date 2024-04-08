const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

app.get('/download', (req, res) => {
  // Ensure there is a query parameter 'videoId'
  const videoId = req.query.videoId;
  if (!videoId) {
    return res.status(400).send('No video ID provided');
  }

  // Construct the YouTube video URL
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // Validate the URL
  if (!ytdl.validateURL(videoUrl)) {
    return res.status(400).send('Invalid video URL');
  }

  // Set headers for the response to indicate a download
  res.header('Content-Disposition', `attachment; filename="video-${videoId}.mp4"`);

  // Use ytdl to download the video and pipe the stream to the response
  ytdl(videoUrl, {
    format: 'mp4'
  }).pipe(res);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
