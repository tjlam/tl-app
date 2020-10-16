const ipc = require("node-ipc");

ipc.config.id = "publisher";
ipc.config.retry = 1500;
ipc.config.maxRetries = 2;

const args = process.argv.slice(2);
console.log(`args`, args);
const spotifyData = {
  PLAYER_EVENT: args[0],
  TRACK_ID: args[1],
  DURATION_MS: args[2],
  POSITION_MS: args[3],
};

ipc.connectTo("main", "/tmp/app.main", () => {
  ipc.of.main.on("connect", () => {
    ipc.of.main.emit("SPOTIFY_DATA", spotifyData);
    process.exit();
  });
});
