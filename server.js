import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import createRoom from './src/server/sockets/createRoom.js';
import checkExistRoom from './src/server/sockets/checkExistRoom.js';
import joinRoom from './src/server/sockets/joinRoom.js';
import checkPlayerList from './src/server/sockets/checkPlayerList.js';
import stayInRoom from './src/server/sockets/stayInRoom.js';
import endRound from './src/server/sockets/endRound.js';
import disconnectPlayer from './src/server/sockets/disconnectPlayer.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rooms = new Map();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/main/index.html`);
});

app.get('/lobby/?room=[\w\d\-]+', (req, res) => {
    res.sendFile(`${__dirname}/public/lobby/index.html`);
});

app.get('/player/?room=[\w\d\-]+&player=[\w\d\-]+', (req, res) => {
    res.sendFile(`${__dirname}/public/main/index.html`);
});

app.use((req, res, next) => {
    res.status(404).sendFile(`${__dirname}/public/404/index.html`);
});

io.on('connection', (socket) => {
    socket.on('createRoom', () => createRoom(socket));

    socket.on('checkExistRoom', (idRoom) => checkExistRoom(socket, rooms, idRoom));

    socket.on('joinRoom', (dataPlayer) => joinRoom(socket, rooms, io, dataPlayer));

    socket.on('checkPlayerList', (idRoom) => checkPlayerList(socket, rooms, idRoom));

    socket.on('stayInRoom', (dataPlayer) => stayInRoom(socket, rooms, io, dataPlayer));

    socket.on('endRound', (roomId) => endRound(socket, rooms, io, roomId));

    socket.on('disconnect', () => disconnectPlayer(socket, rooms, io));
});

httpServer.listen(9000, () => {
    console.log('listening on *:9000');
});
