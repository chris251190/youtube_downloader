const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/download', (req, res) => {
    const url = req.query.url;
    const starttime = req.query.starttime;
    const endtime = req.query.endtime;
  
    console.log('Received download request for URL:', url);
    console.log('Start time:', starttime);
    console.log('End time:', endtime);
  });
  
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});