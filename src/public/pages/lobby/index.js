import copyToClipboard from "/common/js/copyToClipboard.js";
import showPlayerList from "/common/js/showPlayerList.js";
import showErrorAfterElement from "/common/js/showErrorAfterElement.js";
import showMessageAfterElement from "/common/js/showMessageAfterElement.js";
import removeElementAfterTimeout from "/common/js/removeElementAfterTimeout.js";
import {
  ERROR_NAME_NOT_ENTERED,
  MESSAGE_COPIED,
} from "/common/js/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const namePlayerInput = document.querySelector("#name-player-input");
  const linkRoomInput = document.querySelector("#link-room-input");
  const copyLinkBtn = document.querySelector("#copy-link-btn");
  const gotoRoomBtn = document.querySelector("#goto-room-btn");
  const currentLocation = location.origin;
  const urlParams = new URLSearchParams(window.location.search);
  const idRoom = urlParams.get("room");
  const playersRoomList = document.querySelector("#players-room");

  linkRoomInput.value = `${currentLocation}/lobby/?room=${idRoom}`;

  setTimeout(function checkPlayersList() {
    socket.emit("checkPlayersList", idRoom);
    setTimeout(checkPlayersList, 2000);
  }, 1000);

  socket.on("getRoomPlayersData", (data) => {
    showPlayerList(playersRoomList, data.roomPlayers);
  });

  copyLinkBtn.addEventListener("click", () => {
    copyToClipboard(linkRoomInput.value);
    showMessageAfterElement(MESSAGE_COPIED, copyLinkBtn);
    removeElementAfterTimeout(document.querySelector("#info-message"), 1000);
  });

  gotoRoomBtn.addEventListener("click", () => {
    const namePlayer = namePlayerInput.value;
    const idPlayer = socket.id;

    if (idRoom && namePlayer) {
      socket.emit("joinToRoom", { namePlayer, idPlayer, idRoom });

      document.location.href = `${currentLocation}/player/?room=${idRoom}&player=${idPlayer}`;
    } else if (!namePlayer) {
      showErrorAfterElement(ERROR_NAME_NOT_ENTERED, namePlayerInput);
    }

    removeElementAfterTimeout(document.querySelector("#error-message"), 2000);
  });
});
