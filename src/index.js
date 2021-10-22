const express = require('express');
const { series } = require('../data');

const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
});

const PORT = process.env.PORT || 5000;

app.get('/api/series', (req, res) => {
  res.json(series);
});

app.get('*', (req, res) => {
  res.status(404).send('Not found');
});

io.on('connection', (socket) => {
  console.log('connected');
  
  socket.on('play', (time) => {
    console.log('play at', time);
  });
  socket.on('pause', (time) => {
    console.log('pause at', time);
  });
});

server.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
})