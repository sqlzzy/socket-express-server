import { v4 as uuidv4 } from 'uuid';

function createRoom(socket) {
    const idRoom = uuidv4();
    socket.emit('roomCreated', idRoom);
}

export default createRoom;
