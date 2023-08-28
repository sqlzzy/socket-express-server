function updatePlayersData(roomPlayers, socketId) {
    return roomPlayers.filter(player => player?.idPlayer !== socketId);
}

function findHost(roomPlayers, roomHost) {
    return roomPlayers.find(player => player?.idPlayer === roomHost);
}

function findIndexHost(roomPlayers, roomHost) {
    return roomPlayers.findIndex(player => player?.idPlayer === roomHost);
}

function findCurrentPlayer(roomPlayers, socketId) {
    return roomPlayers.find(player => player?.idPlayer === socketId);
}

function isHostCurrentPlayer(currentPlayer) {
    return currentPlayer?.host === 1;
}

function disconnectPlayer(socket, rooms, io) {
    for (const [idRoom, room] of rooms) {
        if (room) {
            let roomPlayers = room?.players;
            let roomHost = room?.host;
            const numberOfPlayers = roomPlayers?.length;
            const socketId = socket?.id;
            const currentHost = findHost(roomPlayers, roomHost);
            const indexHost = findIndexHost(roomPlayers, roomHost);
            const currentPlayer = findCurrentPlayer(roomPlayers, socketId);
            let nextHost;
            let updatedPlayers;

            if (isHostCurrentPlayer(currentPlayer) && numberOfPlayers >= 2 && currentPlayer?.currentUrl) {
                nextHost = roomPlayers[(indexHost + 1) % numberOfPlayers];

                if (!!(nextHost && currentHost)) {
                    room.host = nextHost?.idPlayer;
                    currentHost.host = 0;
                    nextHost.host = 1;

                    io.to(nextHost.idPlayer).emit('becomeHost');
                }

                roomPlayers = updatePlayersData(roomPlayers, socketId);

                io.to(idRoom).emit('playerList', roomPlayers);
            } else if (isHostCurrentPlayer(currentPlayer) && numberOfPlayers === 1 && currentPlayer?.currentUrl) {
                updatedPlayers = updatePlayersData(roomPlayers, socketId);

                if (updatedPlayers.length === 0) {
                    rooms.delete(idRoom);
                }

                roomPlayers = updatedPlayers;

            } else if (roomHost !== socketId && numberOfPlayers >= 2 && currentHost && currentPlayer?.currentUrl) {
                if (numberOfPlayers > 2) {
                    updatedPlayers = updatePlayersData(roomPlayers, socketId);
                } else if (numberOfPlayers === 2) {
                    updatedPlayers = updatePlayersData(roomPlayers, socketId);
                } else if (numberOfPlayers === 1) {
                    updatedPlayers = updatePlayersData(roomPlayers, socketId);
                }

                roomPlayers = updatedPlayers;
            }
            socket.leave(idRoom);
            room.players = roomPlayers;
            io.to(idRoom).emit('playerList', room.players);
        }
    }
};

export default disconnectPlayer;
