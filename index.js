const { WEATHER_API_KEY } = require('./constants');
const { ipc } = require('node-ipc');

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

displayCurrentDateTime();

ipc.config.id = 'main';
ipc.config.retry = 1500;

ipc.serve(() => {
    ipc.server.on('SPOTIFY_DATA', (message, socket) => {
        console.log(message);
    });

    ipc.server.on('socket.disconnected', () => {
        ipc.log('client disconnected');
    });

    ipc.server.on('error', (err) => {
        console.log(err);
    })
});
ipc.server.start();