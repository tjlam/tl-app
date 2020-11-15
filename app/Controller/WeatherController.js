const { DataStore, utils } = require('../utils/actions/index');
const { xTimeHasPassed } = require('../utils/helpers');
// Weather data
const HOUR_TYPE = 'hourly';
const DAY_TYPE = 'daily';

class WeatherController {
  constructor({ window, WeatherViewComponent }) {
    this.window = window;
    this.WeatherViewComponent = WeatherViewComponent;
    this.forecastType = HOUR_TYPE;
    this.selectedForecastIndex = 0;
    const forecastElements = WeatherViewComponent.template.querySelectorAll(
      '.forecast-item'
    );
    this.forecastElementIds = [...forecastElements].map((el) => el.id);
  }

  async getUpdatedWeather() {
    const weatherData = await DataStore.getWeatherData();
    const cleanedData = utils.cleanWeatherData(weatherData);
    return cleanedData;
  }

  saveWeatherData(weatherData) {
    this.window.localStorage.setItem(
      'weatherData',
      JSON.stringify(weatherData)
    );
    const now = new Date();
    const lastUpdated = now.toISOString();
    this.window.localStorage.setItem('lastUpdated', lastUpdated);
  }

  readWeatherData() {
    const weatherDataString = this.window.localStorage.getItem('weatherData');
    if (!weatherDataString) {
      return null;
    }
    return JSON.parse(weatherDataString);
  }

  hasUpdatedWeather() {
    const lastUpdatedTimeString = this.window.localStorage.getItem(
      'lastUpdated'
    );
    const savedWeatherData = this.readWeatherData();

    if (!savedWeatherData || !lastUpdatedTimeString) {
      return false;
    }

    // check if weather was updated in the last 30 mins
    const lastUpdatedTime = new Date(lastUpdatedTimeString);
    const isOldData = xTimeHasPassed(30 * 60 * 1000, lastUpdatedTime);
    return !isOldData;
  }

  formatWeatherData(weatherData) {
    if (this.selectedForecastIndex !== 0) {
      return {
        display: weatherData[this.forecastType][this.selectedForecastIndex],
        details: weatherData[this.forecastType][this.selectedForecastIndex],
        forecast: weatherData[this.forecastType],
        forecastType: this.forecastType,
        selectedForecastIndex: this.selectedForecastIndex,
      };
    }

    return {
      display: weatherData.current,
      details: weatherData[this.forecastType][this.selectedForecastIndex],
      forecast: weatherData[this.forecastType],
      forecastType: this.forecastType,
      selectedForecastIndex: this.selectedForecastIndex,
    };
  }

  handleClick(elementId) {
    if (elementId === 'toggle-input') {
      this.handleForecastModeToggle();
      return;
    }

    if (!this.forecastElementIds.includes(elementId)) {
      return;
    }

    const forecastItemIndex = parseInt(elementId.replace('forecast-item-', ''));
    this.handleForecastItemClick(forecastItemIndex);
  }

  handleForecastItemClick(forecastItemIndex) {
    this.selectedForecastIndex = forecastItemIndex;
    this.renderWeatherView();
  }

  handleForecastModeToggle() {
    this.forecastType = this.forecastType === HOUR_TYPE ? DAY_TYPE : HOUR_TYPE;
    this.renderWeatherView();
  }

  async renderWeatherView() {
    let weatherData;
    if (!this.hasUpdatedWeather()) {
      weatherData = await this.getUpdatedWeather();
      this.saveWeatherData(weatherData);
    } else {
      weatherData = this.readWeatherData();
    }
    if (weatherData) {
      const formattedWeatherData = this.formatWeatherData(weatherData);
      this.WeatherViewComponent.render({ weatherData: formattedWeatherData });
    }
  }
}

module.exports = {
  WeatherControllerClass: WeatherController,
};
