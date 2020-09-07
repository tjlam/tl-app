const { app, BrowserWindow } = require('electron');
const { BROKER_URL } = require('./config');

const mqtt = require('mqtt');
const client = mqtt.connect(BROKER_URL);

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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// handle mqtt events from spotfiy 
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
                break;
            case 'tyler/spotify/trackId':
                console.log('Spotify TrackId', message.toString());
                break;
            case 'tyler/spotify/duration':
                console.log('Spotify Duration', message.toString());
                break;
            case 'tyler/spotify/position':
                console.log('Spotify position', message.toString());
                break;
            default:
                break;
        }
});


