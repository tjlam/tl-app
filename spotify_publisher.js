// const mqtt = require('mqtt');
// const { BROKER_URL } = require('./config');
// const client = mqtt.connect(BROKER_URL);

// client.on('connect', () => {
//     const {PLAYER_EVENT, TRACK_ID, DURATION_MS, POSITION_MS} = process.env;
//     console.log(`Spotify event: `, PLAYER_EVENT);
//     console.log(`Spotify trackId: `, TRACK_ID);
//     console.log(`Spotify track duration: `, DURATION_MS);
//     console.log(`Spotify position`, POSITION_MS);

//     client.publish('tyler/spotify/event', PLAYER_EVENT);
//     client.publish('tyler/spotify/trackId', TRACK_ID);
//     client.publish('tyler/spotify/duration', DURATION_MS);
//     client.publish('tyler/spotify/position', POSITION_MS);
// });

const ipc = require('node-ipc');

ipc.config.id = 'publisher';
ipc.config.retry = 1500;
ipc.config.maxRetries = 2;

const {PLAYER_EVENT, TRACK_ID, DURATION_MS, POSITION_MS} = process.env;
const spotifyData = {
  PLAYER_EVENT,
  TRACK_ID,
  DURATION_MS,
  POSITION_MS
};
console.log(`spotify data`, spotifyData);

ipc.connectTo('main', '/tmp/app.main', () => {
  ipc.of.main.on('connect', () => {
    ipc.of.main.emit('SPOTIFY_DATA', spotifyData);
    process.exit();
  });
});

