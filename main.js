const { app, BrowserWindow, ipcMain } = require("electron");
const { fork } = require("child_process");
const path = require("path");
const { MSG_TYPES } = require("./app/constants");
require("electron-reload")(__dirname);

// setup window
var win;

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1056 * 2,
    height: 257 * 2,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  win.loadFile("app/index.html");

  // Open the DevTools.
  win.webContents.openDevTools();
  return win;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  win = createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const p = fork(path.join(__dirname, "spotifyIPC/ipcServer.js"), [], {
  stdio: ["pipe", "pipe", "pipe", "ipc"],
});

const rotaryProcess = fork(path.join(__dirname, "rotary.js"), [], {
  stdio: ["pipe", "pipe", "pipe", "ipc"],
});

p.on("message", (m) => {
  switch (m.type) {
    case MSG_TYPES.SPOTIFY:
      console.log("Sending spotify data to renderer");
      win.webContents.send(MSG_TYPES.SPOTIFY, m);
      break;

    default:
      console.log(`Unknown msg type: `, m.type);
  }
});

rotaryProcess.on("message", (m) => {
  console.log('Control action:', m);
  win.webContents.send(MSG_TYPES.CONTROL, m);
});

console.log('in main');
