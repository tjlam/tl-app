const { ipcRenderer } = require('./IpcService');

ipcRenderer.sendSync('unique-message', 'ping');