const { Component } = require('../../utils/Classes/Component');
const { tempToText, indexToDay, indexToHour } = require('./utils');
const FILE_TEMPLATE = './app/Components/WeatherView/forecast-template.html';
const HOUR_MODE = 'hourly';
const DAY_MODE = 'daily';

class ForecastView extends Component {
  constructor({ forecastData, onClick, document }) {
    super({ templateFileName: FILE_TEMPLATE, initialProps: { document } });
    this.mode = HOUR_MODE;
    this.forecastData = forecastData;
    this.document = document;
  }

  onClick() {
    debugger;
    this.emitter.emit('event');
  }

  updateForecastItems(forecast) {
    if (!forecast || !forecast.length) {
      return;
    }
    this.forecastData = forecast;

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

    this.document.getElementById(forecastItemDiv.id).onClick = this.onClick;
    // update temp
    const tempDiv = forecastItemDiv.querySelectorAll('.temp')[0];
    tempDiv.innerHTML = tempToText(temp);
    // update time
    const timeDiv = forecastItemDiv.querySelectorAll('.time')[0];
    timeDiv.innerHTML =
      this.mode === HOUR_MODE ? indexToHour(timeId) : indexToDay(timeId);
    // update icon
    const iconDiv = forecastItemDiv.querySelectorAll('.icon')[0];
    iconDiv.innerHTML = iconId;
  }

  render({ forecastData }) {
    this.updateForecastItems(forecastData);
  }
}

module.exports = {
  ForecastView: ForecastView,
};
