function checkDoubleUrl(playersRoom, currentUrl) {
    return playersRoom.some((player) => player.currentUrl === currentUrl);
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
    const { idPlayer, idRoom, currentUrl } = player;
    const idSocket = socket.id;
    const room = rooms.get(idRoom);

    if (room) {
        const playersRoom = room.players;
        const isDoubleUrl = checkDoubleUrl(playersRoom, currentUrl);

        if (isDoubleUrl) {
            redirectToMainPage(idSocket, io);
        }

        socket.join(idRoom);

        const currentPlayer = findCurrentPlayer(playersRoom, idPlayer);

        if (currentPlayer) {
            currentPlayer.idPlayer = idSocket;
            currentPlayer.currentUrl = currentUrl;

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
