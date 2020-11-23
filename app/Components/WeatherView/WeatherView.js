const { Component } = require('../../utils/Classes/Component');
const FILE_TEMPLATE = './app/Components/WeatherView/weather-view-template.html';
const { tempToText, indexToDay } = require('./utils');
const { ForecastView } = require('./ForecastView');
const { WeatherDetailsView } = require('./WeatherDetailsView');
class WeatherView extends Component {
  constructor(initialProps) {
    super({ templateFileName: FILE_TEMPLATE, initialProps });

    this.weatherData = initialProps.weatherData;
    this.svgPath = initialProps.svgPath;
    this.forecastView = new ForecastView({});
    this.weatherDetailsView = new WeatherDetailsView({});
    this.isDarkMode = initialProps.isDarkMode;
    this.forecastPoints = [];
  }

  async onMount() {
    const forecastDiv = this.template.querySelectorAll('#forecast-wrapper')[0];
    // this.forecastView.mount(forecastDiv);

    const detailsDiv = this.template.querySelectorAll(
      '#weather-details-mount'
    )[0];
    this.weatherDetailsView.mount(detailsDiv);
  }

  getTempText() {
    if (!this.weatherData.display) {
      return null;
    }
    const { temp } = this.weatherData.display;
    return tempToText(temp);
  }

  getDescriptionText() {
    if (!this.weatherData.display) {
      return null;
    }
    const { description, feelsLike } = this.weatherData.display;
    return `${description}, feels like ${tempToText(feelsLike)}`;
  }

  getDayText() {
    const { forecastType, selectedForecastIndex } = this.weatherData;
    if (forecastType === 'hourly' || selectedForecastIndex === 0) {
      return 'Today';
    }
    return indexToDay(selectedForecastIndex);
  }

  getIconFile() {
    const { iconId } = this.weatherData.display;
    const prefix = this.isDarkMode
      ? './assets/icons/light/'
      : './assets/icons/dark/';
    return `${prefix}${iconId}.svg`;
  }

  updateCurrentTemp() {
    const currentTempDiv = this.template.querySelectorAll('#current-temp')[0];
    currentTempDiv.innerHTML = this.getTempText();
  }

  updateCurrentIcon() {
    const currentIcon = this.getElement('#current-icon');
    currentIcon.src = this.getIconFile();
  }

  updateCurrentDescription() {
    const currentDescriptionDiv = this.template.querySelectorAll(
      '#current-description'
    )[0];
    currentDescriptionDiv.innerHTML = this.getDescriptionText();
  }

  updateForecast() {
    const { forecast, forecastType } = this.weatherData;
    if (forecast) {
      this.forecastView.render({ forecastData: forecast, forecastType });
    }
  }

  updateCurrentDay() {
    const dayDiv = this.getElement('#current-day');
    dayDiv.innerHTML = this.getDayText();
  }

  updateDetails() {
    const { details } = this.weatherData;
    if (details) {
      this.weatherDetailsView.render({ weatherDetails: details });
    }
  }

  updateForecastLine() {
    const forecastLine = this.getElement('#forecast-line');
    forecastLine.setAttribute('d', this.svgPath);
  }

  render({ weatherData, svgPath, forecastPoints }) {
    this.weatherData = weatherData;
    this.svgPath = svgPath;
    this.forecastPoints = forecastPoints;
    // this.updateForecast();
    this.updateDetails();
    this.updateCurrentTemp();
    this.updateCurrentDescription();
    this.updateCurrentDay();
    this.updateCurrentIcon();
    this.updateForecastLine();
  }
}

module.exports = {
  WeatherView: WeatherView,
};
