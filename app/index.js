const { ipcRenderer } = require("electron");
const { WEATHER_API_KEY, MSG_TYPES } = require("./constants");
let darkMode = false;

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

  MusicPlayerComponent.render({ songId: trackId });
}

ipcRenderer.on(MSG_TYPES.SPOTIFY, (event, data) => {
  console.log(`Renderer received: `, data);
  updateCurrentTrack(data);
});

function toggleDarkMode() {
  darkMode = !darkMode;
  let modeClassName = darkMode ? "dark-mode" : "light-mode";
  let removeClassName = darkMode ? "light-mode" : "dark-mode";

  const body = document.getElementsByTagName("body")[0];
  body.classList.remove(removeClassName);
  body.classList.add(modeClassName);
}

// try some of this new shit out
const screenA = document.getElementById("screen-a");
const screenB = document.getElementById("screen-b");

toggleDarkMode();

const { DateTimeView } = require("./Components/DateTimeView/DateTimeView");
const TimeComponent = new DateTimeView();
TimeComponent.mount(screenA);
TimeComponent.render();

const {
  MusicPlayerView,
} = require("./Components/MusicPlayerView/MusicPlayerView");
const MusicPlayerComponent = new MusicPlayerView();
MusicPlayerComponent.mount(screenB);
MusicPlayerComponent.render({});

// loop every second
function loop() {
  TimeComponent.render();
  var t = setTimeout(loop, 1000);
}

loop();
