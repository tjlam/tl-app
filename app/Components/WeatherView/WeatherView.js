const { Component } = require('../../utils/Classes/Component');
const FILE_TEMPLATE = './app/Components/WeatherView/weather-view-template.html';
const { tempToText } = require('./utils');
const { ForecastView } = require('./ForecastView');
const { WeatherDetailsView } = require('./WeatherDetailsView');
class WeatherView extends Component {
  constructor(initialProps) {
    super({ templateFileName: FILE_TEMPLATE, initialProps });

    this.props = initialProps;
    this.weatherData = initialProps.weatherData;
    this.forecastView = new ForecastView({});
    this.weatherDetailsView = new WeatherDetailsView({});
  }

  async onMount() {
    const forecastDiv = this.template.querySelectorAll('#forecast-wrapper')[0];
    this.forecastView.mount(forecastDiv);

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

  updateCurrentTemp() {
    const currentTempDiv = this.template.querySelectorAll('#current-temp')[0];
    currentTempDiv.innerHTML = this.getTempText();
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

  updateDetails() {
    const { display } = this.weatherData;
    if (display) {
      this.weatherDetailsView.render({ weatherDetails: display });
    }
  }

  render({ weatherData }) {
    this.weatherData = weatherData;
    this.updateForecast();
    this.updateDetails();
    this.updateCurrentTemp();
    this.updateCurrentDescription();
  }
}

module.exports = {
  WeatherView: WeatherView,
};
