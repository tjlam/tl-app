const { WEATHER_API_KEY } = require('./constants');
const { ipcRenderer } = require('electron');

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

anime({
    targets: '#spinny',
    translateX: 250
})

ipcRenderer.on('spotify-state', (event, spotifyData) => {
    console.log(spotifyData);
});

displayCurrentDateTime();
