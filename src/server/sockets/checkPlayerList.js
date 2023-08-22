function checkPlayerList(socket, rooms, idRoom) {
    const room = rooms.get(idRoom);

    if (room) {
        socket.emit('playerList', room.players);
    }
}

export default checkPlayerList;
