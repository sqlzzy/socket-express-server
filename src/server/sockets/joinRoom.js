function joinRoom(socket, rooms, io, dataPlayer) {
    const player = dataPlayer;
    const idPlayer = dataPlayer.idPlayer;
    const idRoom = dataPlayer.idRoom;
    const room = rooms.get(idRoom) || { players: [], host: null };
    const playersRoom = room.players;

    socket.join(player);

    if (!room.host) {
        room.host = idPlayer;
        player.host = 1;
        io.to(room.host).emit('becomeHost', player.host);
    } else {
        player.host = 0;
    }

    playersRoom.push(player);

    rooms.set(idRoom, room);

    io.to(idRoom).emit('playerList', playersRoom);
}

export default joinRoom;

