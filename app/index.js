const { ipcRenderer } = require("electron");
const { WEATHER_API_KEY, MSG_TYPES } = require("./constants");
let darkMode = false;
const {
  MusicPlayerView,
} = require("./Components/MusicPlayerView/MusicPlayerView");
const { WeatherView } = require("./Components/WeatherView/WeatherView");

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
    duration: duration === "undefined" ? null : parseInt(duration),
    position: position === "undefined" ? null : parseInt(position),
  };
}

function updateCurrentSong(spotifyData) {
  const { trackId, playerEvent, duration, position } = processSpotifyData(
    spotifyData
  );

  MusicPlayerComponent.render({
    songId: trackId,
    playerEvent,
    duration,
    position,
  });
}

ipcRenderer.on(MSG_TYPES.SPOTIFY, (event, data) => {
  console.log(`Renderer received: `, data);
  updateCurrentSong(data);
});

ipcRenderer.on(MSG_TYPES.CONTROL, (event, data) => {
  console.log(`Renderer received: `, data);
});

function toggleDarkMode() {
  darkMode = !darkMode;
  let modeClassName = darkMode ? "dark-mode" : "light-mode";
  let removeClassName = darkMode ? "light-mode" : "dark-mode";

  const body = document.getElementsByTagName("body")[0];
  body.classList.remove(removeClassName);
  body.classList.add(modeClassName);
}

function mountMusicPlayer() {
  const MusicPlayerComponent = new MusicPlayerView();
  MusicPlayerComponent.mount(screenB);
  MusicPlayerComponent.render({});
}

function getLatLong() {
  var location = null;
  navigator.geolocation.getCurrentPosition((location) => {
    console.log(`asdf`, location);
    location = {
      lat: location.coords.latitude,
      long: location.coords.longitude,
    };
  });
  return location;
}

// try some of this new shit out
const screenA = document.getElementById("screen-a");
const screenB = document.getElementById("screen-b");

const { DateTimeView } = require("./Components/DateTimeView/DateTimeView");
const TimeComponent = new DateTimeView();
TimeComponent.mount(screenA);
TimeComponent.render();

const WeatherViewComponent = new WeatherView({ window });
WeatherViewComponent.mount(screenB);
WeatherViewComponent.render();

// loop every second
function loop() {
  TimeComponent.render();
  WeatherViewComponent.render();
  // MusicPlayerComponent.incrementPosition();
  var t = setTimeout(loop, 1000);
}

loop();
