const { DataStore, utils } = require('../utils/actions/index');
const { xTimeHasPassed } = require('../utils/helpers');
const { MAX_X, MAX_Y } = require('../constants');
const Spline = require('cubic-spline');

// Weather data
const HOUR_TYPE = 'hourly';
const DAY_TYPE = 'daily';

class WeatherController {
  constructor({ window, WeatherViewComponent }) {
    this.window = window;
    this.WeatherViewComponent = WeatherViewComponent;
    this.forecastType = HOUR_TYPE;
    this.selectedForecastIndex = 0;
    this.spline = null;
    this.dotX = 0;
    this.dotY = 0;
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

  createSpline(points) {
    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    const spline = new Spline(xs, ys);
    return spline;
  }

  getSvgPath() {
    const pathArray = [`M 0 62.5 `];
    var x;
    for (x = 0; x < MAX_X; x++) {
      var y = this.spline.at(x);
      pathArray.push(`L ${x} ${y}`);
    }
    return pathArray.join(' ');
  }

  forecastToPoints(weatherData) {
    const { hourly } = weatherData;
    var sum = 0;
    var numHours = 12;
    const xShift = MAX_X / numHours;
    var x = 60;
    hourly.slice(0, numHours).forEach((hour) => {
      sum += hour.temp;
    });
    const avg = sum / numHours;
    const points = hourly.map((hour, i) => {
      x += xShift;
      return [x, this.tempToPointY(hour.temp, avg)];
    });

    // prepend start point
    const start = [0, this.tempToPointY(avg, avg)];
    points.unshift(start);
    return points;
  }

  tempToPointY(temp, avg) {
    const MID_Y = MAX_Y / 2;
    const diffFromMid = temp - avg;
    const distanceFromMid = -10 * diffFromMid;
    const y = MID_Y + distanceFromMid;
    return Math.floor(y);
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

  handleDotMove(amount) {
    this.dotX = this.dotX + amount;
    this.dotY = this.spline.at(this.dotX);

    anime({
      targets: '#dot',
      cx: this.dotX.toString(),
      cy: this.dotY.toString(),
      duration: 100,
      easing: 'linear',
    });
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
      const forecastPoints = this.forecastToPoints(weatherData);
      const spline = this.createSpline(forecastPoints);
      this.spline = spline;
      const svgPath = this.getSvgPath();
      const formattedWeatherData = this.formatWeatherData(weatherData);
      this.WeatherViewComponent.render({
        weatherData: formattedWeatherData,
        svgPath,
        forecastPoints,
      });
    }
  }
}

module.exports = {
  WeatherControllerClass: WeatherController,
};
