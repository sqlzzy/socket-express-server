function endRound(socket, rooms, io, roomId) {
    const room = rooms.get(roomId);
    let {players: roomPlayers, host: roomHost} = room;
    const numberOfPlayers = roomPlayers?.length;
    const socketId = socket.id;

    if (roomHost === socketId && numberOfPlayers > 1) {
        const indexCurrentHost = roomPlayers.findIndex(player => player.host === 1);
        const nextHostIndex = (indexCurrentHost + 1) % numberOfPlayers;
        const nextHost = roomPlayers[nextHostIndex];
        const currentHost = roomPlayers[indexCurrentHost];

        if (nextHost) {
            room.host = nextHost.idPlayer;
            currentHost.host = 0;
            nextHost.host = 1;

            io.to(nextHost.idPlayer).emit('becomeHost');
            io.to(nextHost.idRoom).emit('playerList', roomPlayers);
            io.to(currentHost.idPlayer).emit('endBecomeHost');
        }
    }
}

export default endRound;
