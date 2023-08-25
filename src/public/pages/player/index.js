document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const inputLinkRoom = document.querySelector('#link-room');
    const btnCopyLinkRoom = document.querySelector('#copy-link-room-btn');
    const endRoundBtn = document.querySelector('#end-round');
    const titlePage = document.querySelector('#title-page');
    const currentLocation = location.origin;
    const urlParams = new URLSearchParams(window.location.search);
    const idRoom = urlParams.get('room');
    const idPlayer = urlParams.get('player');
    const dataPlayer = { idRoom, idPlayer, currentUrl };
    const playerList = document.querySelector('#player-list');
    let currentUrl = document.location.href;

    inputLinkRoom.value = `${currentLocation}/lobby/?room=${idRoom}`;

    socket.emit('stayInRoom', dataPlayer);

    socket.on('getPlayerName', (namePlayer) => {
        document.title = `Player ${namePlayer}`;
        titlePage.textContent = `Player ${namePlayer}`;
    });

    socket.on('playerList', (players) => {
        playerList.innerHTML = '';
        players.forEach((player) => {
            const hostPlayer = player.host === 1 ? 'Host' : '';

            const playerDiv = document.createElement('div');
            playerDiv.innerText = `${player.namePlayer} ${hostPlayer}`;
            playerDiv.id = player.idPlayer;

            playerList.appendChild(playerDiv);
        });
    });

    endRoundBtn.addEventListener('click', () => {
        socket.emit('endRound', dataPlayer.idRoom);
    });

    copyToClipboard(inputLinkRoom.value, btnCopyLinkRoom);

    socket.on('redirect', (url) => {
        document.location.href = url;
    });

    socket.on('becomeHost', () => {
        endRoundBtn.style.display = "block";
    });

    socket.on('endBecomeHost', () => {
        endRoundBtn.style.display = "none";
    });
});
