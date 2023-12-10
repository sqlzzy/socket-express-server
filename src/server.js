import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import createIdRoom from "./server/sockets/createIdRoom.js";
import joinToRoom from "./server/sockets/joinToRoom.js";
import checkPlayersList from "./server/sockets/checkPlayersList.js";
import stayInRoom from "./server/sockets/stayInRoom.js";
import endRound from "./server/sockets/endRound.js";
import disconnectPlayer from "./server/sockets/disconnectPlayer.js";
import createRoundPlayers from "./server/sockets/createRoundPlayers.js";
import initStartGame from "./server/sockets/initStartGame.js";
import {
  MAIN_PAGE_URL,
  PATH_TO_MAIN_PAGE,
  REGEXP_URL_LOBBY_PAGE,
  PATH_TO_LOBBY_PAGE,
  REGEXP_URL_PLAYER_PAGE,
  PATH_TO_PLAYER_PAGE,
  PATH_TO_404_PAGE,
  SERVER_PORT,
} from "./common/js/constants.js";

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

io.on("connection", (socket) => {
  socket.on("createIdRoom", () => createIdRoom(socket));

  socket.on("joinToRoom", (data) => joinToRoom(socket, rooms, io, data));

  socket.on("checkPlayersList", (idRoom) =>
    checkPlayersList(socket, rooms, idRoom)
  );

  socket.on("stayInRoom", (dataPlayer) =>
    stayInRoom(socket, rooms, io, dataPlayer)
  );

  socket.on("createRoundPlayers", (data) => createRoundPlayers(rooms, data));

  socket.on("initStartGame", (data) => initStartGame(rooms, io, data));

  socket.on("endRound", (roomId) => endRound(rooms, io, roomId));

  socket.on("disconnect", () => disconnectPlayer(socket, rooms, io));
});

httpServer.listen(SERVER_PORT, () => {
  console.log(`listening on *:${SERVER_PORT}`);
});
