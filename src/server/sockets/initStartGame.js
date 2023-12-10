export default function initStartGame(rooms, io, data) {
  const { idRoom } = data;
  const room = rooms.get(idRoom);

  if (!!room) {
    const roomPlayers = room?.roomPlayers;

    let roundPlayers = room.round.roundPlayers
      ? room.round.roundPlayers
      : roomPlayers;

    const startGame = (room.round.startGame = 1);

    io.to(idRoom).emit("getRoomPlayersData", { roomPlayers, startGame });
    io.to(idRoom).emit("getRoundPlayersData", { roundPlayers, startGame });
    io.to(idRoom).emit("initEndRound");
  }
}
