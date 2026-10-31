const express = require('express');

const app = express();

app.get('/', (request, response) => {
  response.send('Welcome to my server');
});

app.get('/about', (request, response) => {
  response.json({
    name: 'G.Reddy Chathurya',
    section: 'S02'
  });
});

app.get('/time', (request, response) => {
  const currentDate = new Date();

  response.send(currentDate.toString());
});

app.use((request, response) => {
  response.status(404).send('404 - Page Not Found');
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
