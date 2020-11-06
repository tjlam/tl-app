const { Component } = require('../../utils/Classes/Component');
const FILE_TEMPLATE =
  './app/Components/WeatherView/weather-details-template.html';

const DETAILS_ORDER = [];

class WeatherDetailsView extends Component {
  constructor(initialProps) {
    super({ templateFileName: FILE_TEMPLATE, initialProps });

    this.props = initialProps;
    this.weatherDetails = initialProps.weatherDetails;
  }

  formatWeatherDetails() {}

  render({ weatherDetails }) {
    this.weatherDetails = weatherDetails;
    console.log(this.weatherDetails);
  }
}

module.exports = {
  WeatherDetailsView: WeatherDetailsView,
};
