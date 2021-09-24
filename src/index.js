const express = require('express');
const { series } = require('../data');

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/api/series', (req, res) => {
  res.json(series);
});

app.get('*', (req, res) => {
  res.status(404).send('Not found');
});

app.listen(PORT, )