function joinToRoom(socket, rooms, io, playerData) {
  const { idPlayer, idRoom } = playerData;
  const room = rooms.get(idRoom) || {
    roomPlayers: [],
    host: null,
    round: { startGame: 0, roundPlayers: [] },
  };
  const roomPlayers = room?.roomPlayers;
  const startGame = room?.round?.startGame;

  socket.join(idRoom);

  if (!room.host) {
    room.host = idPlayer;
    playerData.host = 1;
    socket.to(room.host).emit("becomeHost");
  } else {
    playerData.host = 0;
  }

  roomPlayers.push(playerData);

  rooms.set(idRoom, room);

  io.to(idRoom).emit("getRoomPlayersData", { roomPlayers, startGame });
}

export default joinToRoom;
