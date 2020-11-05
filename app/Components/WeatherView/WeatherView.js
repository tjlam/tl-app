const { Component } = require('../../utils/Classes/Component');
const FILE_TEMPLATE = './app/Components/WeatherView/weather-view-template.html';
const { getWeatherData } = require('../../utils/actions/weatherActions');
const { cleanWeatherData, tempToText } = require('./utils');
const { ForecastView } = require('./ForecastView');
class WeatherView extends Component {
  constructor(initialProps) {
    super({ templateFileName: FILE_TEMPLATE, initialProps });

    const { window } = initialProps;
    this.document = initialProps.document;
    this.props = initialProps;
    this.window = window;
    this.weatherData = {};
    this.forecastView = new ForecastView({
      document,
    });
  }

  async onMount() {
    // retrieve weather info
    const forecastDiv = this.template.querySelectorAll('#forecast-wrapper')[0];
    this.forecastView.mount(forecastDiv);
    await this.updateWeatherData();
  }

  getTempText(weatherData) {
    if (!weatherData && !this.weatherData.current) {
      return null;
    }
    const { temp } = weatherData || this.weatherData.current;
    return tempToText(temp);
  }

  getDescriptionText(weatherData) {
    if (!this.weatherData.current || !weatherData) {
      return null;
    }
    const { description, feelsLike } = weatherData || this.weatherData.current;
    return `${description}, feels like ${tempToText(feelsLike)}`;
  }

  writeWeatherData() {
    this.window.localStorage.setItem(
      'weatherData',
      JSON.stringify(this.weatherData)
    );
    const date = new Date();
    const lastUpdated = date.toISOString();
    this.window.localStorage.setItem('lastUpdated', lastUpdated);
  }

  readWeatherData() {
    const weatherDataString = this.window.localStorage.getItem('weatherData');
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
    const lastUpdatedTimestamp = new Date(lastUpdatedTimeString);
    const currentTimestamp = new Date();
    const diff = Math.floor(
      (currentTimestamp - lastUpdatedTimestamp) / 1000 / 60
    );
    return diff < 30;
  }

  async updateWeatherData() {
    const weatherData = await getWeatherData();
    console.log(weatherData);
    const cleanedData = cleanWeatherData(weatherData);
    this.weatherData = cleanedData;
    this.writeWeatherData();
    console.log(cleanedData);
  }

  updateCurrentTemp(temp) {
    const currentTempDiv = this.template.querySelectorAll('#current-temp')[0];
    currentTempDiv.innerHTML = temp || this.getTempText();
  }

  updateCurrentDescription(description) {
    const currentDescriptionDiv = this.template.querySelectorAll(
      '#current-description'
    )[0];
    currentDescriptionDiv.innerHTML = description || this.getDescriptionText();
  }

  updateForecast() {
    const { hourly } = this.weatherData;
    if (hourly) {
      this.forecastView.render({ forecastData: hourly });
    }
  }

  handleForecastItemClick(key) {
    debugger;
    const forecastData = this.weatherData.hourly[key];
    if (key === undefined || !forecastData) {
      return;
    }
    console.log('clicked');
    const temp = this.getTempText(forecastData);
    const description = this.getDescriptionText(forecastData);
    this.updateCurrentTemp(temp);
    this.updateCurrentDescription(description);
  }

  render() {
    if (!this.hasUpdatedWeather()) {
      this.updateWeatherData();
    }
    this.updateForecast();
    this.updateCurrentTemp();
    this.updateCurrentDescription();

    var t = setTimeout(this.render.bind(this), 1000);
  }
}

module.exports = {
  WeatherView: WeatherView,
};
