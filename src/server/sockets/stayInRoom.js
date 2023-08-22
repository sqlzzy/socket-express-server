function checkDoubleUrl(playersRoom, currentUrlPlayer) {
    return playersRoom.some((player) => player.currentUrl === currentUrlPlayer);
}

function findCurrentPlayer(playersRoom, idPlayer) {
    return playersRoom.find((player) => player.idPlayer === idPlayer);
}

function redirectToMainPage(idSocket, io) {
    io.to(idSocket).emit('redirect', '/');

    return;
}

function stayInRoom(socket, rooms, io, dataPlayer) {
    const player = dataPlayer;
    const idPlayer = player.idPlayer;
    const idRoom = player.idRoom;
    const currentUrlPlayer = player.currentUrl;
    const idSocket = socket.id;
    const room = rooms.get(idRoom);

    if (room) {
        const playersRoom = room.players;
        const isDoubleUrl = checkDoubleUrl(playersRoom, currentUrlPlayer);

        if (isDoubleUrl) {
            redirectToMainPage(idSocket, io);
        }

        socket.join(idRoom);

        const currentPlayer = findCurrentPlayer(playersRoom, idPlayer);

        if (currentPlayer) {
            currentPlayer.idPlayer = idSocket;
            currentPlayer.currentUrl = currentUrlPlayer;

            if (currentPlayer.host) {
                room.host = currentPlayer.idPlayer;

                currentPlayer.host = 1;

                io.to(room.host).emit('becomeHost', currentPlayer.host);
            } else {
                currentPlayer.host = 0;
            }

            io.to(currentPlayer.idRoom).emit('playerList', playersRoom);
            io.to(idSocket).emit('getPlayerName', currentPlayer.namePlayer);
        }
    } else {
        redirectToMainPage(idSocket, io);
    }
}

export default stayInRoom;
