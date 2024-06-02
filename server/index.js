const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}.`);
  });
  socket.on('send_message', (data) => {
    console.log(data);
    socket.to(data.room).emit('recive_message', data);
  });
  socket.on('disonnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server is connected');
});