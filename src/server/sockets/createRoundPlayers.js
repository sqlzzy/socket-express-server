export default function createRoundPlayers(rooms, data) {
  const { idRoom, roomPlayers, startGame } = data;
  const room = rooms.get(idRoom);

  if (!!room) {
    room.round.startGame = startGame;

    if (startGame) {
      room.round.roundPlayers = roomPlayers;
    } else {
      room.round.roundPlayers = roomPlayers ? roomPlayers : room.roomPlayers;
    }
  }
}
