const express = require('express');

const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origins: ['http://localhost:3000', 'https://player.fernandoparra.me'],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

app.get('*', (_req, res) => {
  res.status(404).send('Not found');
});

const getUsersInRoom = (roomName) => {
  const room = io.sockets.adapter.rooms.get(roomName) || [];
  const roomIds = Array.from(room);
  const sockets = io.sockets.sockets;
  const users = roomIds.map(x => sockets.get(x).user);
  return users;
};

io.on('connection', (socket) => {
  console.log('connected');
  
  socket.on('join', (message) => {
    socket.user = message.user;
    socket.join(message.room);
    socket.room = message.room;
    console.log(`User ${message.user} joined to room ${message.room}`);
    const users = getUsersInRoom(message.room);
    io.in(message.room).emit('joined', {room: message.room, user: message.user, users});
  });
  socket.on('disconnect', () => {
    console.log(`User ${socket.user} left the room ${socket.room}`);
    const users = getUsersInRoom(socket.room);
    socket.to(socket.room).emit('left', {room: socket.room, user: socket.user, users});
  });
  
  socket.on('play', (message) => {
    console.log(`User ${message.user} touched play at ${message.time} in room ${message.room}`);
    socket.to(message.room).emit('play', message);
  });
  socket.on('pause', (message) => {
    console.log(`User ${message.user} touched pause at ${message.time} in room ${message.room}`);
    socket.to(message.room).emit('pause', message);
  });
  socket.on('changeTime', (message) => {
    console.log(`User ${message.user} changed time to ${message.time} in room ${message.room}`);
    socket.to(message.room).emit('changeTime', message);
  });
  socket.on('startWaiting', (message) => {
    socket.to(message.room).emit('startWaiting', message);
  });
  socket.on('stopWaiting', (message) => {
    socket.to(message.room).emit('stopWaiting', message);
  });
});

server.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
})