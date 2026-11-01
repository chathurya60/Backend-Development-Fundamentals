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

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
