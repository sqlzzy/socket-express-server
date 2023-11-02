import { v4 as uuidv4 } from "uuid";

function createIdRoom(socket) {
  const idRoom = uuidv4();
  socket.emit("getIdCreatedRoom", idRoom);
}

export default createIdRoom;
