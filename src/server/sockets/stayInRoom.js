function checkDoubleUrl(roomPlayers, currentUrl) {
  return roomPlayers.some((player) => player?.currentUrl === currentUrl);
}

function findCurrentPlayer(roomPlayers, idPlayer) {
  return roomPlayers.find((player) => player?.idPlayer === idPlayer);
}

function redirectToMainPage(socketId, io) {
  io.to(socketId).emit("redirect", "/");

  return;
}

function stayInRoom(socket, rooms, io, playerData) {
  const { idPlayer, idRoom, currentUrl } = playerData;
  const socketId = socket.id;
  const room = rooms.get(idRoom);

  if (room) {
    const roomPlayers = room?.roomPlayers;
    const isDoubleUrl = checkDoubleUrl(roomPlayers, currentUrl);
    const startGame = room?.round?.startGame;
    const roundPlayers = room?.round?.roundPlayers;

    if (isDoubleUrl) {
      redirectToMainPage(socketId, io);
    }

    socket.join(idRoom);

    const currentPlayer = findCurrentPlayer(roomPlayers, idPlayer);

    if (currentPlayer) {
      currentPlayer.idPlayer = socketId;
      currentPlayer.currentUrl = currentUrl;

      if (currentPlayer.host) {
        room.host = currentPlayer.idPlayer;

        currentPlayer.host = 1;

        io.to(currentPlayer.idPlayer).emit("becomeHost");
      } else {
        currentPlayer.host = 0;
      }

      io.to(idRoom).emit("getRoomPlayersData", {
        roomPlayers,
        startGame,
        roundPlayers,
      });
      io.to(currentPlayer.idPlayer).emit(
        "getPlayerName",
        currentPlayer.namePlayer
      );
    } else {
      redirectToMainPage(socketId, io);
    }
  } else {
    redirectToMainPage(socketId, io);
  }
}

export default stayInRoom;
