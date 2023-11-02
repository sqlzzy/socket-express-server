function endRound(rooms, io, roomId) {
  const room = rooms.get(roomId);

  if (!!room) {
    const { roomPlayers } = room;
    const numberOfRoomPlayers = roomPlayers.length;

    if (numberOfRoomPlayers > 1) {
      const indexCurrentHost = roomPlayers.findIndex(
        (player) => player.host === 1
      );
      const nextHostIndex = (indexCurrentHost + 1) % numberOfRoomPlayers;
      const nextHost = roomPlayers[nextHostIndex];
      const currentHost = roomPlayers[indexCurrentHost];
      const startGame = (room.round.startGame = 0);
      let roundPlayers;

      if (!!nextHost) {
        room.host = nextHost?.idPlayer;
        currentHost.host = 0;
        nextHost.host = 1;

        roundPlayers = room.round.roundPlayers = roomPlayers;

        io.to(nextHost.idPlayer).emit("becomeHost", roomPlayers);
        io.to(nextHost.idRoom).emit("getRoomPlayersData", {
          roomPlayers,
          startGame,
          roundPlayers,
        });
        io.to(nextHost.idRoom).emit("getRoundPlayersData", {
          roomPlayers,
          startGame,
          roundPlayers,
        });
        io.to(roomId).emit("resetGame", { roomPlayers, startGame });
      }
    }
  }
}

export default endRound;
