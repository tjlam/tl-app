const { Component } = require("../../utils/Classes/Component");
const TEMPLATE_FILE_NAME =
  "./app/Components/DateTimeView/date-time-template.html";

class DateTime extends Component {
  constructor({ templateFileName, initialProps = {}, parentElement = null }) {
    super({
      templateFileName: TEMPLATE_FILE_NAME,
      initialProps,
      parentElement,
    });
  }

  updateTimeLabel(timeText) {
    const TimeLabel = this.template.querySelectorAll("#time-label");
    TimeLabel[0].innerHTML = timeText;
  }

  updateDateLabel(dateText) {
    const DateLabel = this.template.querySelectorAll("#date-label");
    DateLabel[0].innerHTML = dateText;
  }

  getCurrentTime() {
    let ts = Date.now();

    let dateObj = new Date(ts);

    let hour = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let seconds = dateObj.getSeconds();

    return {
      hour,
      minutes,
      seconds,
    };
  }

  getCurrentDate() {
    let ts = Date.now();

    let dateObj = new Date(ts);

    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();

    return {
      day,
      month,
      year,
    };
  }

  formatDateString({ day, month, year }) {
    return `${day}, ${month} ${year}`;
  }

  formatTimeString({ hour, minutes, seconds }) {
    return `${hour}:${minutes}:${seconds}`;
  }

  render() {
    const timeText = this.formatTimeString(this.getCurrentTime());
    const dateText = this.formatDateString(this.getCurrentDate());
    this.updateTimeLabel(timeText);
    this.updateDateLabel(dateText);
  }
}

module.exports = {
  DateTime: DateTime,
};
