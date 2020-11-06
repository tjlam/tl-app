const { Component } = require('../../utils/Classes/Component');
const { tempToText, indexToDay, indexToHour } = require('./utils');
const FILE_TEMPLATE = './app/Components/WeatherView/forecast-template.html';
const HOUR_TYPE = 'hourly';
const DAY_TYPE = 'daily';

class ForecastView extends Component {
  constructor({ forecastData }) {
    super({ templateFileName: FILE_TEMPLATE });
    this.forecastType = HOUR_TYPE;
    this.forecastData = forecastData;
  }

  updateForecastItems(forecast, forecastType) {
    if (!forecast || !forecast.length) {
      return;
    }
    this.forecastData = forecast;
    this.forecastType = forecastType;

    forecast.forEach((forecastItem, key) => {
      const divId = `#forecast-item-${key}`;
      const { temp, iconId } = forecastItem;
      this.updateForecastItem({ id: divId, temp, iconId, timeId: key });
    });
  }

  updateForecastItem({ id, temp, timeId, iconId }) {
    const forecastItemDiv = this.template.querySelectorAll(id)[0];
    if (!forecastItemDiv) {
      return;
    }

    // update temp
    const tempDiv = forecastItemDiv.querySelectorAll('.temp')[0];
    tempDiv.innerHTML = tempToText(temp);
    // update time
    const timeDiv = forecastItemDiv.querySelectorAll('.time')[0];
    timeDiv.innerHTML =
      this.forecastType === HOUR_TYPE
        ? indexToHour(timeId)
        : indexToDay(timeId);
    // update icon
    const iconDiv = forecastItemDiv.querySelectorAll('.icon')[0];
    iconDiv.innerHTML = iconId;
  }

  render({ forecastData, forecastType }) {
    this.updateForecastItems(forecastData, forecastType);
  }
}

module.exports = {
  ForecastView: ForecastView,
};
