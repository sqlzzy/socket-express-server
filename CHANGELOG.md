# Change Log

All notable changes to this project will be documented in this file.

## Project "socket-express-server"

### Version 1.0.0 - 31.07.2023

### Added

- main and player pages
- server configuration file (server.js)

**Main page**

- check for filling in the "Your name" and "ID room" fields before a user enters the room
- 10-character limit for the "Your name" field
- 36-character limit for the "ID room" field
- a button to create ID room
- adding the generated character set to the "ID room" field after clicking the "Create room" button
- replacing the manually entered character set in the "ID room" field with the generated character set after clicking on the "Create room" button
- a button to copy ID room
- copy ID room from the "ID room" field to the clipboard after clicking on the "Copy ID room" button
- go to the /player/ page after filling in the "Your name" and "ID room" fields and clicking on the "Go!" button

**Player page**

- giving the right to host the game to the user who entered the room first
- display ID room in the "ID room" field
- copy ID room from the "ID room" field to the clipboard after clicking on the "Copy ID room" button
- transfer host rights to the next player when the "End" button is pressed and the number of players in the room is more than two
- adding the "End" button to a new host
- transferring host rights to the next player after the current host leaves the room
- deleting a room from the server after the last player leaves the room
- redirect to main page when creating a duplicate of /player/?
- redirect to main page on page reload /player/?

### Version 1.1.0 - 7.08.2023

### Added

- CHANGELOG.md

### Version 2.0.0 - 27.08.2023

### Added

- lobby page
- display errors:
    if room id exists;
    if room id and name player not entered;
    if room id or name player not entered.
- real-time display of the list of players in the room
- 404 page
- src/server/sockets, where files with functions for socket.io event processing are located
- new file structure
- src/common/, where common files for pages are located

**Lobby page**

- check for filling in the "Your name" field before a user enters the room
- 10-character limit for the "Your name" field
- a button to copy ID room
- copy ID room from the "ID room" field to the clipboard after clicking on the "Copy ID room" button
- go to the /player/ page after filling in the "Your name" and "ID room" fields and clicking on the "Go!" button
- real-time display of the list of players in the room
- title page

### Changed

- replaced public folder to src/
- replaced server.js to src/

**Main page**

- display error "A room with that id already exists" if room id exists
- display error "Player name and room id not entered" if room id and name player not entered
- display error "Player name not entered" if name player not entered
- display error "Room id not entered" if room id not entered

**Player page**

- change title page

### Version 2.1.0 - 28.08.2023

### Fixed

- transferring host rights to the next player after the current host leaves the room

### Version 2.1.0 - 2.11.2023

### Added

- create a list of players in the round
- display the list of players in a round
- display messages for players
- function of waiting for the end of the round for incoming players after the start of the game
- style for all pages
