import showErrorAfterElement from "/common/js/showErrorAfterElement.js";
import showMessageAfterElement from "/common/js/showMessageAfterElement.js";
import copyToClipboard from "/common/js/copyToClipboard.js";
import removeElementAfterTimeout from "/common/js/removeElementAfterTimeout.js";
import {
  ERROR_NAME_NOT_ENTERED,
  MESSAGE_COPIED,
} from "/common/js/constants.js";
import testValidName from "../../../common/js/testValidName.js";

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const namePlayerInput = document.querySelector("#name-player-input");
  const linkRoomInput = document.querySelector("#link-room-input");
  const copyLinkBtn = document.querySelector("#copy-link-btn");
  const gotoRoomBtn = document.querySelector("#goto-room-btn");
  const currentLocation = location.origin;

  socket.emit("createIdRoom");

  socket.on("getIdCreatedRoom", (idRoom) => {
    linkRoomInput.value = `${currentLocation}/lobby/?room=${idRoom}`;
    linkRoomInput.dataset.idRoom = idRoom;
  });

  copyLinkBtn.addEventListener("click", () => {
    copyToClipboard(linkRoomInput.value);
    showMessageAfterElement(MESSAGE_COPIED, copyLinkBtn);
    removeElementAfterTimeout(document.querySelector("#info-message"), 1000);
  });

  gotoRoomBtn.addEventListener("click", () => {
    const namePlayer = namePlayerInput.value;
    const idPlayer = socket.id;
    const idRoom = linkRoomInput.dataset.idRoom;
    const validNamePlayer = testValidName(namePlayer);

    if (idRoom && validNamePlayer) {
      socket.emit("joinToRoom", { namePlayer, idPlayer, idRoom });

      document.location.href = `${currentLocation}/player/?room=${idRoom}&player=${idPlayer}`;
    } else if (!validNamePlayer) {
      namePlayerInput.value = "";
      showErrorAfterElement(ERROR_NAME_NOT_ENTERED, namePlayerInput);
    }

    removeElementAfterTimeout(document.querySelector("#error-message"), 2000);
  });
});
