function endRound(socket, rooms, io, roomId) {
    const room = rooms.get(roomId);

    if (room.host === socket.id && room.players.length > 1) {
        const currentHost = room.players.find(player => player.idPlayer === room.host);
        const indexCurrentHost = room.players.findIndex(player => player.host === 1);
        let nextHost;

        if (indexCurrentHost === room.players.length - 1) {
            nextHost = room.players[0];
        } else {
            nextHost = room.players[indexCurrentHost + 1];
        }

        const updatedPlayers = room.players.map(player => {
            if (player.host === 1) {
                return { ...player, host: 0 };
            }

            return player;
        });

        if (nextHost) {
            room.host = nextHost.idPlayer;
            currentHost.host = 0;
            nextHost.host = 1;

            io.to(nextHost.idPlayer).emit('becomeHost');
            io.to(currentHost.idPlayer).emit('endBecomeHost');
        }

        room.players = updatedPlayers;
        io.to(nextHost.idRoom).emit('playerList', room.players);
    }
}

export default endRound;
