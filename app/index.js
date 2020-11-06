const { ipcRenderer } = require('electron');
const { WEATHER_API_KEY, MSG_TYPES } = require('./constants');
let darkMode = false;
const {
  MusicPlayerView,
} = require('./Components/MusicPlayerView/MusicPlayerView');
const { WeatherView } = require('./Components/WeatherView/WeatherView');
const { DateTimeView } = require('./Components/DateTimeView/DateTimeView');
const {
  RotaryController: RotaryControllerClass,
} = require('./utils/Classes/RotaryController');
const { WeatherControllerClass } = require('./Controller/WeatherController');

// All components
const MusicPlayerComponent = new MusicPlayerView();
const TimeComponent = new DateTimeView();
const WeatherViewComponent = new WeatherView({
  window,
  document,
});

// mounting components
const screenA = document.getElementById('screen-a');
const screenB = document.getElementById('screen-b');

TimeComponent.mount(screenA);
TimeComponent.render();

WeatherViewComponent.mount(screenB);

const RotaryController = new RotaryControllerClass(document);

document.onkeydown = (e) => {
  if (e.keyCode === 75) {
    RotaryController.handleMove(-2);
  }
  if (e.keyCode === 76) {
    RotaryController.handleMove(2);
  }
  if (e.keyCode === 32) {
    const el = RotaryController.getCurrentHTMLElement();

    const clickCallbacks = getClickCallbacks(el.id);
    RotaryController.handleClick(clickCallbacks);
  }
};

const getClickCallbacks = (id) => {
  return () => {
    weatherController.handleClick(id);
  };
};

const weatherController = new WeatherControllerClass({
  window,
  WeatherViewComponent,
});

// loop every second
function loop() {
  TimeComponent.render();
  // MusicPlayerComponent.incrementPosition();

  weatherController.renderWeatherView();
  var t = setTimeout(loop, 1000);
}

loop();

// event handling
ipcRenderer.on(MSG_TYPES.SPOTIFY, (event, data) => {
  console.log(`Renderer received: `, data);
  updateCurrentSong(data);
});

ipcRenderer.on(MSG_TYPES.CONTROL, (event, data) => {
  console.log(`Renderer received: `, data);
  if (data.action === 'left' || data.action === 'right') {
    RotaryController.handleMove(data.amount);
  }
  if (data.action === 'press') {
    RotaryController.handleClick();
  }
});

// helpers
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
    duration: duration === 'undefined' ? null : parseInt(duration),
    position: position === 'undefined' ? null : parseInt(position),
  };
}

function toggleDarkMode() {
  darkMode = !darkMode;
  let modeClassName = darkMode ? 'dark-mode' : 'light-mode';
  let removeClassName = darkMode ? 'light-mode' : 'dark-mode';

  const body = document.getElementsByTagName('body')[0];
  body.classList.remove(removeClassName);
  body.classList.add(modeClassName);
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

function mountMusicPlayer() {
  const MusicPlayerComponent = new MusicPlayerView();
  MusicPlayerComponent.mount(screenB);
  MusicPlayerComponent.render({});
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
