const { ipcRenderer } = require('electron');
const { WEATHER_API_KEY, MSG_TYPES } = require('./constants');

function currentTime() {
    let ts = Date.now();

    let dateObj = new Date(ts);

    let date = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();

    let hour = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let seconds = dateObj.getSeconds();

    return {
        date,
        month,
        year,
        hour,
        minutes,
        seconds
    }
}

function displayCurrentDateTime() {
    const { date, month, year, hour, minutes, seconds } = currentTime();
    document.getElementById('datetime').innerText = `${date} ${month} ${year} and ${hour}:${minutes}:${seconds}`;
    var t = setTimeout(displayCurrentDateTime, 1000);
}

function processSpotifyData(spotifyData) {
    const {
        TRACK_ID: trackId,
        PLAYER_EVENT: playerEvent,
        DURATION_MS: duration,
        POSITION_MS: position
    } = spotifyData;

    return {
        trackId,
        playerEvent,
        duration,
        position
    }
}

function updateCurrentTrack(spotifyData) {
    const {
        trackId,
        playerEvent,
        duration,
        position
    } = processSpotifyData(spotifyData);

    const trackText = `${playerEvent} - ${trackId} - ${duration} - ${position}`;
    document.getElementById('track-info').innerText = trackText;
}

anime({
    targets: '#spinny',
    translateX: 250
})

displayCurrentDateTime();

ipcRenderer.on(MSG_TYPES.SPOTIFY, (event, data) => {
    console.log(`Renderer received: `, data);
    updateCurrentTrack(data);
});