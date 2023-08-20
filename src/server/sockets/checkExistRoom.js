function checkExistRoom(socket, rooms, idRoom) {
    const isExistRoom = rooms.has(idRoom);
    
    socket.emit('roomExist', isExistRoom);
}

export default checkExistRoom;