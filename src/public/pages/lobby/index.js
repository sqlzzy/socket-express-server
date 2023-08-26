import copyToClipboard from '/common/js/copyToClipboard.js';
import showPlayerList from '/common/js/showPlayerList.js';
import showErrorAfterElement from '/common/js/showErrorAfterElement.js';

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const inputLinkRoom = document.querySelector('#link-room');
    const btnCopyLinkRoom = document.querySelector('#copy-link-room-btn');
    const inputNamePlayer = document.querySelector('#name-player');
    const btnStart = document.querySelector('#start-btn');
    const titlePage = document.querySelector('#title-page');
    const currentLocation = location.origin;
    const urlParams = new URLSearchParams(window.location.search);
    const idRoom = urlParams.get('room');
    const playerList = document.querySelector('#player-list');

    document.title = `Lobby room ${idRoom}`;
    titlePage.textContent = `Lobby room ${idRoom}`;

    inputLinkRoom.value = `${currentLocation}/lobby/?room=${idRoom}`;

    setTimeout(function checkPlayerList() {
        socket.emit('checkPlayerList', idRoom);
        setTimeout(checkPlayerList, 1000);
    }, 1000);

    socket.on('playerList', (players) => showPlayerList(playerList, players));

    btnCopyLinkRoom.addEventListener('click', () => copyToClipboard(inputLinkRoom.value));

    btnStart.addEventListener('click', () => {
        const namePlayer = inputNamePlayer.value
        const idPlayer = socket.id;

        if (namePlayer) {
            const dataPlayer = { namePlayer, idPlayer, idRoom };

            socket.emit('joinRoom', dataPlayer);

            document.location.href = `${currentLocation}/player/?room=${idRoom}&player=${idPlayer}`;
        } else if (!namePlayer) {
            showErrorAfterElement('Player name not entered', btnStart);
        }
    });
});