const { Component } = require("../../utils/Classes/Component");
const TEMPLATE_FILE_NAME =
  "./app/Components/DateTimeView/date-time-template.html";

class DateTime extends Component {
  constructor(initialProps) {
    super({
      templateFileName: TEMPLATE_FILE_NAME,
      initialProps,
    });
    this.currentDate = null;
  }

  updateTimeLabel(timeText) {
    const TimeLabel = this.template.querySelectorAll("#time-label");
    TimeLabel[0].innerHTML = timeText;
  }

  updateDateLabel(dateText) {
    const DateLabel = this.template.querySelectorAll("#date-label");
    DateLabel[0].innerHTML = dateText;
    this.currentDate = dateText;
  }

  getCurrentTime() {
    let ts = Date.now();

    let dateObj = new Date(ts);

    let hour = dateObj.getHours();
    let minutes = dateObj.getMinutes();

    return {
      hour,
      minutes,
    };
  }

  getCurrentDate() {
    let ts = Date.now();

    let dateObj = new Date(ts);

    let day = dateObj.getDate();
    let dayOfWeek = dateObj.getDay();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();

    return {
      day,
      dayOfWeek,
      month,
      year,
    };
  }

  formatDateString({ day, dayOfWeek, month, year }) {
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${DAYS[dayOfWeek]}. ${MONTHS[month - 1]}. ${day}, ${year}`;
  }

  formatTimeString({ hour, minutes }) {
    if (hour === 0) { hour = 12 };
    var regularHour = hour > 12 ? hour - 12 : hour;
    const prependZero = (time) => time > 9 ? time : `0${time}`;
    const AMorPM = hour > 12 ? 'PM' : 'AM';
    return `${prependZero(regularHour)}:${prependZero(minutes)} ${AMorPM}`;
  }

  render() {
    const timeText = this.formatTimeString(this.getCurrentTime());
    const dateText = this.formatDateString(this.getCurrentDate());
    if (this.currentDate !== dateText) {
      this.updateDateLabel(dateText);
    }
    this.updateTimeLabel(timeText);
  }
}

module.exports = {
  DateTime: DateTime,
};
