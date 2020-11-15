const { Component } = require('../../utils/Classes/Component');
const FILE_TEMPLATE =
  './app/Components/WeatherView/weather-details-template.html';

const DETAIL_KEYS_ORDERED = [
  'prob',
  'rain',
  'snow',
  'tempHighLow',
  'humidity',
  'windSpeed',
  'sunrise',
  'sunset',
  'feelsLikeMorn',
  'feelsLikeEve',
  'feelsLikeNight',
  'pressure',
];

const DETAIL_LABELS_ORDERED = [
  'PROB. PRECIPITATION',
  'RAIN',
  'SNOW',
  'HIGH/LOW',
  'HUMIDITY',
  'WIND SPEED',
  'SUNRISE',
  'SUNSET',
  'MORNING FEELS LIKE',
  'EVE. FEELS LIKE',
  'NIGHT FEELS LIKE',
  'PRESSURE',
];

class WeatherDetailsView extends Component {
  constructor(initialProps) {
    super({ templateFileName: FILE_TEMPLATE, initialProps });

    this.props = initialProps;
    this.weatherDetails = initialProps.weatherDetails;
  }

  clearDetails() {
    DETAIL_KEYS_ORDERED.forEach((key, labelIndex) => {
      this.updateDetail('', '', labelIndex);
    });
  }

  updateDetails() {
    let detailIndex = 0;
    DETAIL_KEYS_ORDERED.forEach((key, labelIndex) => {
      const value = this.weatherDetails[key];
      const label = DETAIL_LABELS_ORDERED[labelIndex];
      if (value) {
        this.updateDetail(label, value, detailIndex);
        detailIndex += 1;
      }
    });
  }

  updateDetail(label, value, index) {
    const labelId = `#detail-${index}-label`;
    const labelEl = this.getElement(labelId);

    const valueId = `#detail-${index}-value`;
    const valueEl = this.getElement(valueId);

    if (!labelEl || !valueEl) {
      return;
    }

    valueEl.innerHTML = value;
    labelEl.innerHTML = label;
  }

  render({ weatherDetails }) {
    console.log(this.weatherDetails);
    this.clearDetails();
    this.weatherDetails = weatherDetails;
    this.updateDetails();
  }
}

module.exports = {
  WeatherDetailsView: WeatherDetailsView,
};
