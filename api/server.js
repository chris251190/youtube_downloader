const port = 3000;
const express = require('express');
const app = express();

app.get('/download', (req, res) => {
  res.send('This is the download route!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;




