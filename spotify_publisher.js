const mqtt = require('mqtt');
const { BROKER_URL } = require('./config');
const client = mqtt.connect(BROKER_URL);

client.on('connect', () => {
    const {PLAYER_EVENT, TRACK_ID, DURATION_MS} = process.env;
    console.log(`Spotify event: `, PLAYER_EVENT);
    console.log(`Spotify trackId: `, TRACK_ID);
    console.log(`Spotify track duration: `, DURATION_MS);
    console.log(`spotify: `, process.env);

    client.publish('tyler/spotify/event', { PLAYER_EVENT, TRACK_ID });
});
