const { exec } = require('child_process');
const path = require('path');

const {PLAYER_EVENT, TRACK_ID, DURATION_MS, POSITION_MS} = process.env;
console.log(`process.env`, process.env);

const p = exec(`sudo node ${path.join(__dirname, 'spotify_publisher.js')}`, {
    env: process.env
});