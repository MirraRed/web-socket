// Імпорт бібліотек:
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Створення серверу:
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:63342",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const users = {};

io.on('connection', socket => {
    // Коли новий користувач підключається
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });

    // Коли користувач відправляє повідомлення в чат
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });

    // Коли користувач відключається
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
