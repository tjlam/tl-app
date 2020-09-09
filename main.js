const { app, BrowserWindow } = require('electron');
const { BROKER_URL } = require('./config');

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://192.168.4.70');
let win;

// setup window
function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Open the DevTools.
  win.webContents.openDevTools()

  return win;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    win = createWindow();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// handle mqtt events from spotify
const SPOTIFY_STATE = {
    event: null,
    trackId: null,
    duration: null,
    position: null
}

client.on('connect', () => {
        client.subscribe([
            'tyler/spotify/event',
            'tyler/spotify/trackId', 
            'tyler/spotify/duration', 
            'tyler/spotify/position'
        ]);
    });

    client.on('message', (topic, message) => {
        switch(topic) {
            case 'tyler/spotify/event':
                console.log(`Spotify Event:`, message.toString());
                SPOTIFY_STATE.event = message.toString();
                break;
            case 'tyler/spotify/trackId':
                console.log('Spotify TrackId', message.toString());
                SPOTIFY_STATE.trackId = message.toString();
                break;
            case 'tyler/spotify/duration':
                console.log('Spotify Duration', message.toString());
                SPOTIFY_STATE.duration = message.toString();
                break;
            case 'tyler/spotify/position':
                console.log('Spotify Position', message.toString());
                SPOTIFY_STATE.position = message.toString();
                break;
            default:
                break;
        }
        // send updated spotify state
        win.webContents.send('spotify-state', SPOTIFY_STATE);
});

// const ipc = require('node-ipc');

// ipc.config.id = 'main';
// ipc.config.retry = 1500;

// ipc.serve('/usr/local/bin/app.main', () => {
//     ipc.server.on('SPOTIFY_DATA', (message, socket) => {
//         console.log(message);
//     });

//     ipc.server.on('socket.disconnected', () => {
//         ipc.log('client disconnected');
//     });

//     ipc.server.on('error', (err) => {
//         console.log(err);
//     })
// });
// ipc.server.start();

