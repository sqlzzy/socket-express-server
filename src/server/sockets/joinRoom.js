function joinRoom(socket, rooms, io, dataPlayer) {
    const player = dataPlayer;
    const idPlayer = dataPlayer.idPlayer;
    const idRoom = dataPlayer.idRoom;
    const room = rooms.get(idRoom) || { players: [], host: null };
    let hostRoom = room.host;
    const playersRoom = room.players;

    socket.join(player);

    if (!hostRoom) {
      hostRoom = idPlayer;
      player.host = 1;
      io.to(hostRoom).emit('becomeHost', player.host);
    } else {
      player.host = 0;
    }

    playersRoom.push(player);

    rooms.set(idRoom, room);

    io.to(idRoom).emit('playerList', playersRoom);
}

export default joinRoom;

