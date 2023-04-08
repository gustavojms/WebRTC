const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;

app.use(express.static(__dirname + '/public'));

app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/client', (req, res) => {
    res.sendFile(__dirname + '/public/client.html');
});

io.on('connection', (socket) => {
  console.log('A new user connected');

  socket.on('join', (username) => {
    console.log(`${username} joined the room`);
    io.emit('user joined', username);
  });

  socket.on('offer', (offer, trackId) => {
    socket.broadcast.emit('offer', offer, trackId);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('icecandidate', (candidate) => {
    socket.broadcast.emit('icecandidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
