function checkPlayersList(socket, rooms, idRoom) {
  const room = rooms.get(idRoom);

  if (!!room) {
    const roomPlayers = room?.roomPlayers;
    const startGame = room?.round?.startGame;
    const roundPlayers = room?.round?.roundPlayers;

    socket.emit("getRoomPlayersData", { roomPlayers, startGame });
    socket.emit("getRoundPlayersData", { roundPlayers, startGame });
  }
}

export default checkPlayersList;
