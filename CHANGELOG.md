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
- go to the /player/ page? after filling in the "Your name" and "ID room" fields and clicking on the "Go!" button

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
