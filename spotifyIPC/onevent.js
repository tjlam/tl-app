const { exec } = require("child_process");
const path = require("path");

const publisherPath = path.join(__dirname, "spotify_publisher.js");

const { PLAYER_EVENT, TRACK_ID, DURATION_MS, POSITION_MS } = process.env;
const args = `${PLAYER_EVENT} ${TRACK_ID} ${DURATION_MS} ${POSITION_MS}`;

const p = exec(
  `sudo node ${publisherPath} ${args}`,
  (error, stdout, stderr) => {
    if (error) {
      console.log(error);
    }
    console.log(stdout);
    console.log(stderr);
  }
);
