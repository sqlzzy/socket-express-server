import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import createRoom from './server/sockets/createRoom.js';
import checkExistRoom from './server/sockets/checkExistRoom.js';
import joinRoom from './server/sockets/joinRoom.js';
import checkPlayerList from './server/sockets/checkPlayerList.js';
import stayInRoom from './server/sockets/stayInRoom.js';
import endRound from './server/sockets/endRound.js';
import disconnectPlayer from './server/sockets/disconnectPlayer.js';
import {
    MAIN_PAGE_URL,
    PATH_TO_MAIN_PAGE,
    REGEXP_URL_LOBBY_PAGE,
    PATH_TO_LOBBY_PAGE,
    REGEXP_URL_PLAYER_PAGE,
    PATH_TO_PLAYER_PAGE,
    PATH_TO_404_PAGE,
    SERVER_PORT,
} from './common/js/constants.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rooms = new Map();

app.use(express.static(__dirname));
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/public/pages`));
app.use(express.static(`${__dirname}/common`));


app.get(MAIN_PAGE_URL, (req, res) => {
    res.sendFile(`${__dirname}${PATH_TO_MAIN_PAGE}`);
});

app.get(REGEXP_URL_LOBBY_PAGE, (req, res) => {
    res.sendFile(`${__dirname}${PATH_TO_LOBBY_PAGE}`);
});

app.get(REGEXP_URL_PLAYER_PAGE, (req, res) => {
    res.sendFile(`${__dirname}${PATH_TO_PLAYER_PAGE}`);
});

app.use((req, res) => {
    res.status(404).sendFile(`${__dirname}${PATH_TO_404_PAGE}`);
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

httpServer.listen(SERVER_PORT, () => {
    console.log(`listening on *:${SERVER_PORT}`);
});
