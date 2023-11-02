function updatePlayersData(players, socketId) {
  return players.filter((player) => player.idPlayer !== socketId);
}

function findHost(players, roomHost) {
  return players.find((player) => player.idPlayer === roomHost);
}

function findIndexHost(players, roomHost) {
  return players.findIndex((player) => player.idPlayer === roomHost);
}

function findCurrentPlayer(players, socketId) {
  return players.find((player) => player.idPlayer === socketId);
}

function isHostCurrentPlayer(currentPlayer) {
  return currentPlayer?.host === 1;
}

function disconnectPlayer(socket, rooms, io) {
  for (const [idRoom, room] of rooms) {
    if (!!room) {
      let roomPlayers = room?.roomPlayers;
      let roomHost = room?.host;
      let roundPlayers = room?.round?.roundPlayers;
      const numberOfRoomPlayers = roomPlayers.length;
      const socketId = socket.id;
      const currentHost = findHost(roomPlayers, roomHost);
      const indexHost = findIndexHost(roomPlayers, roomHost);
      const currentRoomPlayer = findCurrentPlayer(roomPlayers, socketId);
      let nextHost;
      let updatedRoomPlayers;
      let updatedRoundPlayers;
      let startGame = room?.round?.startGame;

      if (
        isHostCurrentPlayer(currentRoomPlayer) &&
        numberOfRoomPlayers >= 2 &&
        !!currentRoomPlayer?.currentUrl
      ) {
        nextHost = roomPlayers[(indexHost + 1) % numberOfRoomPlayers];

        if (!!(nextHost && currentHost)) {
          room.host = nextHost?.idPlayer;
          currentHost.host = 0;
          nextHost.host = 1;
          room.round.startGame = 0;

          io.to(nextHost.idPlayer).emit("becomeHost");
        }

        roomPlayers = updatePlayersData(roomPlayers, socketId);
        roundPlayers = updatePlayersData(roundPlayers, socketId);

        room.roomPlayers = room.round.roundPlayers = roundPlayers = roomPlayers;

        startGame = room.round.startGame = 0;
        io.to(idRoom).emit("getRoomPlayersData", {
          roomPlayers,
          startGame,
          roundPlayers,
        });
        socket.to(nextHost.idPlayer).emit("becomeHost", roomPlayers);
        io.to(idRoom).emit("resetGame", { roomPlayers, startGame });
      } else if (
        isHostCurrentPlayer(currentRoomPlayer) &&
        numberOfRoomPlayers === 1 &&
        !!currentRoomPlayer?.currentUrl
      ) {
        updatedRoomPlayers = updatePlayersData(roomPlayers, socketId);

        if (updatedRoomPlayers.length === 0) {
          rooms.delete(idRoom);
        }

        roomPlayers = updatedRoomPlayers;
      } else if (
        roomHost !== socketId &&
        numberOfRoomPlayers >= 2 &&
        !!currentHost &&
        !!currentRoomPlayer?.currentUrl
      ) {
        if (numberOfRoomPlayers > 2) {
          updatedRoomPlayers = updatePlayersData(roomPlayers, socketId);
          updatedRoundPlayers = updatePlayersData(roundPlayers, socketId);

          if (updatedRoundPlayers.length < 2) {
            startGame = room.round.startGame = 0;

            io.to(idRoom).emit("resetGame", {
              roomPlayers: updatedRoomPlayers,
              startGame,
            });
          }
        } else if (numberOfRoomPlayers === 2) {
          updatedRoomPlayers = updatePlayersData(roomPlayers, socketId);
          updatedRoundPlayers = updatePlayersData(roundPlayers, socketId);

          if (updatedRoundPlayers.length < 2) {
            startGame = room.round.startGame = 0;

            io.to(idRoom).emit("resetGame", {
              roomPlayers: updatedRoomPlayers,
              startGame,
            });
          }
        } else if (numberOfRoomPlayers === 1) {
          updatedRoomPlayers = updatePlayersData(roomPlayers, socketId);
          updatedRoundPlayers = updatePlayersData(roundPlayers, socketId);

          if (updatedRoundPlayers.length < 2) {
            startGame = room.round.startGame = 0;

            io.to(idRoom).emit("resetGame", {
              roomPlayers: updatedRoomPlayers,
              startGame,
            });
          }
        }

        roomPlayers = updatedRoomPlayers;
        roundPlayers = updatedRoundPlayers;
      }

      socket.leave(idRoom);
      room.roomPlayers = roomPlayers;
      room.round.roundPlayers = !startGame ? roomPlayers : roundPlayers;

      if (!startGame) {
        io.to(idRoom).emit("getRoomPlayersData", {
          roomPlayers,
          startGame,
          roundPlayers: roomPlayers,
        });
        io.to(idRoom).emit("getRoundPlayersData", {
          roundPlayers: roomPlayers,
        });
        io.to(idRoom).emit("resetGame", { roomPlayers, startGame });
      } else {
        io.to(idRoom).emit("getRoomPlayersData", {
          roomPlayers,
          startGame,
          roundPlayers,
        });
        io.to(idRoom).emit("getRoundPlayersData", { roundPlayers });
      }
    }
  }
}

export default disconnectPlayer;
