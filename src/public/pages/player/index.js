import copyToClipboard from "/common/js/copyToClipboard.js";
import showPlayerList from "/common/js/showPlayerList.js";
import showElement from "/common/js/showElement.js";
import hideElement from "/common/js/hideElement.js";
import showMessageAfterElement from "/common/js/showMessageAfterElement.js";
import removeElementAfterTimeout from "/common/js/removeElementAfterTimeout.js";
import {
  MESSAGE_COPIED,
  MESSAGE_WAIT_HOST_TO_START_GAME,
  MESSAGE_WAIT_ROUND_TO_END,
  MESSAGE_NEED_MORE_PLAYERS,
} from "/common/js/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const linkRoomInput = document.querySelector("#link-room-input");
  const copyLinkBtn = document.querySelector("#copy-link-btn");
  const startGameBtn = document.querySelector("#start-game-btn");
  const subtitlePage = document.querySelector("#subtitle-page");
  const currentLocation = location.origin;
  const urlParams = new URLSearchParams(window.location.search);
  const idRoom = urlParams.get("room");
  const idPlayer = urlParams.get("player");
  const currentUrl = document.location.href;
  const dataPlayer = { idRoom, idPlayer, currentUrl };
  const elRoomPlayersList = document.querySelector("#players-room");
  const elRoundPlayersList = document.querySelector("#players-round");
  const elRoundPlayersInfo = document.querySelector("#players-round-info");
  const gameResult = document.querySelector("#game-result");
  const nextRoundBtn = gameResult.querySelector("#next-round-btn");
  const waitInfo = document.querySelector("#wait-info");

  linkRoomInput.value = `${currentLocation}/lobby/?room=${idRoom}`;

  socket.emit("stayInRoom", dataPlayer);

  socket.on("getPlayerName", (namePlayer) => {
    document.title = `Player ${namePlayer}`;
    subtitlePage.textContent = `Player ${namePlayer}`;
  });

  function filterPlayersHostList(players) {
    return players.filter(
      (player) => player.host && socket.id === player.idPlayer
    );
  }

  function filterOtherPlayersList(players) {
    return players.filter(
      (player) => !player.host && socket.id === player.idPlayer
    );
  }

  socket.on("getRoomPlayersData", (data) => {
    const { roomPlayers, startGame, roundPlayers } = data;

    if ((roomPlayers && startGame) || roomPlayers) {
      showPlayerList(elRoomPlayersList, roomPlayers);

      const filteredPlayersHostList = filterPlayersHostList(roomPlayers);
      const filteredOtherPlayersList = filterOtherPlayersList(roomPlayers);
      const currentPlayerHost = filteredPlayersHostList[0];
      const currentOtherPlayer = filteredOtherPlayersList[0];

      if (roomPlayers.length === 1 && currentPlayerHost && !startGame) {
        waitInfo.textContent = MESSAGE_NEED_MORE_PLAYERS;
        showElement(waitInfo);
        hideElement(startGameBtn);
      } else if (roomPlayers.length >= 2 && currentPlayerHost && !startGame) {
        hideElement(waitInfo);
        showElement(startGameBtn);
        socket.emit("createRoundPlayers", { idRoom, roomPlayers, startGame });
      }

      if (roomPlayers.length >= 2 && currentOtherPlayer && !startGame) {
        waitInfo.textContent = MESSAGE_WAIT_HOST_TO_START_GAME;
        showElement(waitInfo);
      }
    }

    if (roundPlayers && startGame) {
      const existRoundPlayer = roundPlayers.some(
        (player) => socket.id === player.idPlayer
      );

      if (!existRoundPlayer) {
        waitInfo.textContent = MESSAGE_WAIT_ROUND_TO_END;
        showElement(waitInfo);
        showPlayerList(elRoundPlayersList, roundPlayers);
        showElement(elRoundPlayersInfo);
      }
    }
  });

  startGameBtn.addEventListener("click", () => {
    socket.emit("initStartGame", { idRoom });
  });

  socket.on("getRoundPlayersData", (data) => {
    const { roundPlayers } = data;

    if (roundPlayers) {
      showPlayerList(elRoundPlayersList, roundPlayers);
    }
  });

  copyLinkBtn.addEventListener("click", () => {
    copyToClipboard(linkRoomInput.value);
    showMessageAfterElement(MESSAGE_COPIED, copyLinkBtn);
    removeElementAfterTimeout(document.querySelector("#info-message"), 1000);
  });

  socket.on("initEndRound", () => {
    hideElement(waitInfo);
    hideElement(startGameBtn);
    showElement(elRoundPlayersInfo);
    showElement(gameResult);
  });

  nextRoundBtn.addEventListener("click", () => {
    socket.emit("endRound", idRoom);
  });

  function resetGame(roomPlayers, startGame) {
    startGame = 0;
    hideElement(gameResult);

    if (roomPlayers && roomPlayers.length === 1) {
      hideElement(startGameBtn);
    }

    socket.emit("createRoundPlayers", { idRoom, roomPlayers, startGame });
  }

  socket.on("resetGame", (data) => {
    const { roomPlayers, startGame } = data;

    resetGame(roomPlayers, startGame);
  });

  socket.on("becomeHost", (roomPlayers) => {
    if (roomPlayers && roomPlayers.length >= 2) {
      showElement(startGameBtn);
    } else {
      resetGame(roomPlayers);
    }
  });

  socket.on("redirect", (url) => {
    document.location.href = url;
  });
});
