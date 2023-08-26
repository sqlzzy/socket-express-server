import copyToClipboard from '/common/js/copyToClipboard.js';
import showPlayerList from '/common/js/showPlayerList.js';
import showElement from '/common/js/showElement.js';
import hideElement from '/common/js/hideElement.js';

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const inputLinkRoom = document.querySelector('#link-room');
    const btnCopyLinkRoom = document.querySelector('#copy-link-room-btn');
    const endRoundBtn = document.querySelector('#end-round');
    const titlePage = document.querySelector('#title-page');
    const currentLocation = location.origin;
    const urlParams = new URLSearchParams(window.location.search);
    const idRoom = urlParams.get('room');
    const idPlayer = urlParams.get('player');
    const currentUrl = document.location.href;
    const dataPlayer = { idRoom, idPlayer, currentUrl };
    const playerList = document.querySelector('#player-list');

    inputLinkRoom.value = `${currentLocation}/lobby/?room=${idRoom}`;

    socket.emit('stayInRoom', dataPlayer);

    socket.on('getPlayerName', (namePlayer) => {
        document.title = `Player ${namePlayer}`;
        titlePage.textContent = `Player ${namePlayer}`;
    });

    socket.on('playerList', (players) => showPlayerList(playerList, players));

    endRoundBtn.addEventListener('click', () => {
        socket.emit('endRound', dataPlayer.idRoom);
    });

    btnCopyLinkRoom.addEventListener('click', () => copyToClipboard(inputLinkRoom.value));

    socket.on('redirect', (url) => {
        document.location.href = url;
    });

    socket.on('becomeHost', () => showElement(endRoundBtn));

    socket.on('endBecomeHost', () => hideElement(endRoundBtn));
});
