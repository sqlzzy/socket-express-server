import { createError } from '/common/js/createError.js';

function showErrorAfterElement(errorText, element) {
    const spanError = createError(errorText);
    element.insertAdjacentElement('afterend', spanError);
}

document.addEventListener("DOMContentLoaded", (event) => {
    const socket = io();
    const inputNamePlayer = document.querySelector('#name-player');
    const btnCreateRoom = document.querySelector('#create-room-btn');
    const inputIdRoom = document.querySelector('#id-room');
    const btnCopyIdRoom = document.querySelector('#copy-id-room-btn');
    const btnStart = document.querySelector('#start-btn');
    const textEnter = document.querySelector('#text-enter');
    const currentLocation = location.origin;

    btnCreateRoom.addEventListener('click', () => {
        socket.emit('createRoom');
    });

    socket.on('roomCreated', (idRoom) => {
        btnCreateRoom.style.display = "none";
        textEnter.style.display = "none";
        btnCopyIdRoom.style.display = "block";
        inputIdRoom.value = idRoom;
    });

    btnCopyIdRoom.addEventListener('click', () => {
        navigator.clipboard.writeText(inputIdRoom.value);
    });

    btnStart.addEventListener('click', () => {
        const idRoom = inputIdRoom.value;

        socket.emit('checkExistRoom', idRoom);
    });

    socket.on('roomExist', (isExist) => {
        const namePlayer = inputNamePlayer.value
        const idRoom = inputIdRoom.value;
        const idPlayer = socket.id;
        const errorMessage = document.getElementById('error-message');

        if (errorMessage) {
            errorMessage.textContent = '';
        }

        if (isExist) {
            showErrorAfterElement('A room with that id already exists', btnStart);
        } else {
            if (idRoom && namePlayer) {
                socket.emit('joinRoom',  { namePlayer, idPlayer, idRoom });

                document.location.href = `${currentLocation}/player/?room=${idRoom}&player=${idPlayer}`;
            } else if (!idRoom && !namePlayer) {
                showErrorAfterElement('Player name and room id not entered', btnStart);
            } else if (!idRoom) {
                showErrorAfterElement('Room id not entered', btnStart);
            } else if (!namePlayer) {
                showErrorAfterElement('Player name not entered', btnStart);
            }
        }
    });
});