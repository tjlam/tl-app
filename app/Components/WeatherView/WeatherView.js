const { Component } = require("../../utils/Classes/Component");
const FILE_TEMPLATE = "./app/Components/WeatherView/weather-view-template.html";
const { getWeatherData } = require("../../utils/actions/weatherActions");
const { cleanWeatherData } = require("./utils");

class WeatherView extends Component {
  constructor(initialProps) {
    super({ templateFileName: FILE_TEMPLATE, initialProps });

    const { window } = initialProps;
    this.window = window;
    this.weatherData = {};
  }

  async onMount() {
    // retrieve weather info
    await this.getWeatherData();
  }

  getCurrentTempText() {
    if (!this.weatherData.current) {
      return null;
    }
    const { temp } = this.weatherData.current;
    return `${Math.round(temp)}˚C`;
  }

  getCurrentDescriptionText() {
    if (!this.weatherData.current) {
      return null;
    }
    console.log(this.weatherData);
    const { description } = this.weatherData.current;
    return description;
  }

  writeWeatherData() {
    this.window.localStorage.setItem(
      "weatherData",
      JSON.stringify(this.weatherData)
    );
    const date = new Date();
    const lastUpdated = date.toISOString();
    this.window.localStorage.setItem("lastUpdated", lastUpdated);
  }

  readWeatherData() {
    const weatherDataString = this.window.localStorage.getItem("weatherData");
    return JSON.parse(weatherDataString);
  }

  hasUpdatedWeather() {
    const lastUpdatedTimeString = this.window.localStorage.getItem(
      "lastUpdated"
    );
    const lastUpdatedTimestamp = new Date(lastUpdatedTimeString);
    const currentTimestamp = new Date();
    const diff = Math.floor(
      (currentTimestamp - lastUpdatedTimestamp) / 1000 / 60
    );
    console.log(diff);
    return diff < 30;
  }

  async getWeatherData() {
    const savedWeatherData = this.readWeatherData();

    if (!this.hasUpdatedWeather() || !savedWeatherData) {
      const weatherData = await getWeatherData();
      const cleanedData = cleanWeatherData(weatherData);
      this.weatherData = cleanedData;
      this.writeWeatherData();
      return;
    }
    this.weatherData = savedWeatherData;
  }

  updateCurrentTemp() {
    const currentTempDiv = this.template.querySelectorAll("#current-temp")[0];
    currentTempDiv.innerHTML = this.getCurrentTempText();
  }

  updateCurrentDescription() {
    const currentDescriptionDiv = this.template.querySelectorAll(
      "#current-description"
    )[0];
    currentDescriptionDiv.innerHTML = this.getCurrentDescriptionText();
  }

  render() {
    this.updateCurrentTemp();
    this.updateCurrentDescription();
  }
}

module.exports = {
  WeatherView: WeatherView,
};
