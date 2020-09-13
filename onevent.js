const { fork } = require('child_process');
const path = require('path');

const {PLAYER_EVENT, TRACK_ID, DURATION_MS, POSITION_MS} = process.env;
console.log(`process.env`, process.env);

const p = fork(path.join(__dirname, 'spotify_publisher.js'), [PLAYER_EVENT, TRACK_ID, DURATION_MS, POSITION_MS], {
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
});