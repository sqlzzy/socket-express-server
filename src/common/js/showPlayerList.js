export default function showPlayerList(element, players) {
    element.innerHTML = '';
    players.forEach((player) => {
        const hostPlayer = player.host === 1 ? 'Host' : '';

        const playerDiv = document.createElement('div');
        playerDiv.innerText = `${player.namePlayer} ${hostPlayer}`;
        playerDiv.id = player.idPlayer;

        element.appendChild(playerDiv);
    });
}