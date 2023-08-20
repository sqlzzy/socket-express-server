import { v4 as uuidv4 } from 'uuid';

function ceateRoom(socket) {
    socket.on('createRoom', () => {
        const idRoom = uuidv4();
        socket.emit('roomCreated', idRoom);
    });
}

export default createRoom;
