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
    socket.broadcast.emit('played', time);
  });
  socket.on('pause', (time) => {
    socket.broadcast.emit('paused', time);
  });
  socket.on('seeked', (time) => {
    socket.broadcast.emit('seek', time);
  });
});

server.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
})