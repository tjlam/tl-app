const {
  getWeatherData,
  cleanWeatherData,
  tempToText,
  indexToDay,
  indexToHour,
} = require('./weatherActions');
const { getSongData } = require('./spotifyActions');

const DataStore = {
  getWeatherData,
  getSongData,
};

const utils = {
  cleanWeatherData,
  tempToText,
  indexToDay,
  indexToHour,
};

module.exports = {
  DataStore: DataStore,
  utils: utils,
};
