const ipc = require('node-ipc');
const { exec } = require('child_process');

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

exec('npm start', (error, stdout, stderr) => {
    if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
      }
      console.log('Child Process STDOUT: '+stdout);
      console.log('Child Process STDERR: '+stderr);
});
