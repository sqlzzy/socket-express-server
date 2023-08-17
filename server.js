import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

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

function checkExistRoom(idRoom) {
  return rooms.has(idRoom);
}

io.on('connection', (socket) => {
  socket.on('createRoom', () => {
    const idRoom = uuidv4();
    socket.emit('roomCreated', idRoom);
  });

  socket.on('checkExistRoom', (idRoom) => {
    const isExistRoom = checkExistRoom(idRoom);
    
    socket.emit('roomExist', isExistRoom);
  });

  socket.on('joinRoom', (dataPlayer) => {
    socket.join(dataPlayer);
 
    const room = rooms.get(dataPlayer.idRoom) || { players: [], host: null };

    if (!room.host) {
      room.host = dataPlayer.idPlayer;
      dataPlayer.host = 1;
      io.to(room.host).emit('becomeHost', dataPlayer.host);
    } else {
      dataPlayer.host = 0;
    }

    room.players.push(dataPlayer);

    rooms.set(dataPlayer.idRoom, room);

    io.to(dataPlayer.idRoom).emit('playerList', room.players);
  });

  socket.on('checkPlayerList', (idRoom) => {
    const room = rooms.get(idRoom);
    if (room) {
      socket.emit('playerList', room.players);
    }
  });

  socket.on('stayInRoom', (dataPlayer) => {
    const room = rooms.get(dataPlayer.idRoom);

    if (room) {
      const isDoubleUrl = room.players.some((player) => player.currentUrl === dataPlayer.currentUrl);

      if (isDoubleUrl) {
        io.to(socket.id).emit('redirect', '/');

        return;
      }

      socket.join(dataPlayer.idRoom);
      const currentPlayer = room.players.find((player) => player.idPlayer === dataPlayer.idPlayer);


      if (currentPlayer) {
        currentPlayer.idPlayer = socket.id;
        currentPlayer.currentUrl = dataPlayer.currentUrl;
      } else {
        io.to(socket.id).emit('redirect', '/');

        return;
      }

      if (currentPlayer.host === 1) {
        room.host = currentPlayer.idPlayer;
        
        currentPlayer.host = 1;
        io.to(room.host).emit('becomeHost', currentPlayer.host);
      } else {
        currentPlayer.host = 0;
      }

      io.to(currentPlayer.idRoom).emit('playerList', room.players);
      io.to(currentPlayer.idRoom).emit('getPlayerName', currentPlayer.namePlayer);
    } else {
      io.to(socket.id).emit('redirect', '/');

      return;
    }
  });

  socket.on('emitPlayerName', (dataPlayer) => {
    const room = rooms.get(dataPlayer.idRoom);
    if(room) {
      console.log(room.players)
      console.log(dataPlayer.idPlayer)
      const currentPlayer = room.players.find((player) => player.idPlayer === dataPlayer.idPlayer);
      console.log(currentPlayer, 'currentPlayer');
      //return currentPlayer.namePlayer;
    }
  });

  socket.on('endRound', (roomId) => {
    const room = rooms.get(roomId);

    if (room.host === socket.id && room.players.length > 1) {
      const currentHost = room.players.find(player => player.idPlayer === room.host);
      const indexCurrentHost = room.players.findIndex(player => player.host === 1);
      let nextHost;

      if (indexCurrentHost === room.players.length - 1) {
        nextHost = room.players[0];
      } else {
        nextHost = room.players[indexCurrentHost+1];
      }

      const updatedPlayers = room.players.map(player => {
        if (player.host === 1) {
          return { ...player, host: 0 };
        }

        return player;
      });

      if (nextHost) {
        room.host = nextHost.idPlayer;
        currentHost.host = 0;
        nextHost.host = 1;

        io.to(nextHost.idPlayer).emit('becomeHost');
        io.to(currentHost.idPlayer).emit('endBecomeHost');
      }

      room.players = updatedPlayers;
      io.to(nextHost.idRoom).emit('playerList', room.players);
    }
  });

  socket.on('disconnect', () => {
    for (const [idRoom, room] of rooms) {
      if (room) {
        let roomPlayers = room.players;
        const currentHost = roomPlayers.filter(player => player.idPlayer === room.host);
        const indexCurrentHost = roomPlayers.findIndex(player => player.host === 1);
        const currentPlayer = roomPlayers.find(player => player.idPlayer === socket.id);
        const isHostCurrentPlayer = currentPlayer?.host === 1 ? 1 : 0;
        let nextHost;
        let updatedData = roomPlayers;

        if (isHostCurrentPlayer && roomPlayers.length >= 2 && currentPlayer?.currentUrl) {
            if (indexCurrentHost === roomPlayers.length - 1) {
              nextHost = roomPlayers[0];
            } else {
              nextHost = roomPlayers[indexCurrentHost+1];
            }
  
            updatedData = roomPlayers.filter((player) => player.idPlayer !== socket.id);
            roomPlayers = updatedData;
      
            if (nextHost) {
              room.host = nextHost.idPlayer;
              currentHost.host = 0;
              nextHost.host = 1;
      
              io.to(nextHost.idPlayer).emit('becomeHost', nextHost.host);
            }

            io.to(nextHost.idRoom).emit('playerList', roomPlayers);
        } else if (isHostCurrentPlayer && roomPlayers.length === 1 && currentPlayer?.currentUrl) {
          updatedData = roomPlayers.filter((player) => player.idPlayer !== socket.id);

          if (updatedData.length === 0) {
            rooms.delete(idRoom);
          }

          roomPlayers = updatedData;
          
        } else if (room.host !== socket.id && roomPlayers.length >= 2 && currentHost && currentPlayer?.currentUrl) {

          if (roomPlayers.length > 2) {
            updatedData = roomPlayers.filter((player) => player.idPlayer !== socket.id);
          } else if (roomPlayers.length === 2) {
            updatedData = roomPlayers.filter((player) => player.idPlayer !== socket.id);
          } else if (roomPlayers.length === 1) {
            updatedData = roomPlayers.filter((player) => player.idPlayer !== socket.id);
          }

          roomPlayers = updatedData;
        }
        socket.leave(room);
        room.players = roomPlayers;
        io.to(idRoom).emit('playerList', room.players);
      }
    }
  });
});

httpServer.listen(9000, () => {
  console.log('listening on *:9000');
});
