export default function showPlayerList(element, players) {
  element.innerHTML = "";

  players.forEach((player) => {
    const hostPlayer = player.host === 1 ? "Host" : "";

    const playerLi = document.createElement("li");
    playerLi.innerText = `${player.namePlayer} ${hostPlayer}`;
    playerLi.id = player.idPlayer;
    playerLi.classList.add("player");
    element.appendChild(playerLi);
  });
}
