function endRound(socket, rooms, io, roomId) {
    const room = rooms.get(roomId);
    const indexLastPlayer = room.players.length - 1;
    const firstPlayer = room.players[0];
    const nextPlayer = room.players[indexCurrentHost + 1];

    if (room.host === socket.id && room.players.length > 1) {
        const currentHost = room.players.find(player => player.idPlayer === room.host);
        const indexCurrentHost = room.players.findIndex(player => player.host === 1);
        const nextHost = indexCurrentHost === indexLastPlayer ? firstPlayer : nextPlayer;

        const updatedPlayers = room.players.map(player => {
            if (player.host === 1) {
                return { ...player, host: 0 };
            }

            return player;
        });

        if (nextHost) {
            currentHost.host = 0;
            nextHost.host = 1;
            room.host = nextHost.idPlayer;

            io.to(nextHost.idPlayer).emit('becomeHost');
            io.to(currentHost.idPlayer).emit('endBecomeHost');
        }

        room.players = updatedPlayers;
        io.to(nextHost.idRoom).emit('playerList', room.players);
    }
}

export default endRound;
