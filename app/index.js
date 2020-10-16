const { ipcRenderer } = require("electron");
const { WEATHER_API_KEY, MSG_TYPES } = require("./constants");

function processSpotifyData(spotifyData) {
  const {
    TRACK_ID: trackId,
    PLAYER_EVENT: playerEvent,
    DURATION_MS: duration,
    POSITION_MS: position,
  } = spotifyData;

  return {
    trackId,
    playerEvent,
    duration,
    position,
  };
}

function updateCurrentTrack(spotifyData) {
  const { trackId, playerEvent, duration, position } = processSpotifyData(
    spotifyData
  );

  const trackText = `${playerEvent} - ${trackId} - ${duration} - ${position}`;
  document.getElementById("track-info").innerText = trackText;
}

ipcRenderer.on(MSG_TYPES.SPOTIFY, (event, data) => {
  console.log(`Renderer received: `, data);
  updateCurrentTrack(data);
});

// try some of this new shit out
const screenA = document.getElementById("screen-a");

const { DateTimeView } = require("./Components/DateTimeView/DateTimeView");
const TimeComponent = new DateTimeView({ parentElement: screenA });
TimeComponent.mount();
TimeComponent.render();

// loop every second
function loop() {
  TimeComponent.render();
  var t = setTimeout(loop, 1000);
}

loop();
