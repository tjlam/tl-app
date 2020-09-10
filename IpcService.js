const { ipc } = require('node-ipc');

ipc.config.id = 'main';
ipc.config.retry = 1500;

const ipcHandler = () => {
    ipc.server.on('SPOTIFY_DATA', (message, socket) => {
        console.log(message);
    });

    ipc.server.on('socket.disconnected', () => {
        ipc.log('client disconnected');
    });

    ipc.server.on('error', (err) => {
        console.log(err);
    })
};

ipc.server.start();

module.exports = {
    ipcRenderer: ipcRenderer
}