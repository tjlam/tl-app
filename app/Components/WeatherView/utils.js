const tempToText = (temp) => {
  return `${Math.round(temp)}˚`;
};

const DAYS_OF_WEEK_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const indexToDay = (index) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  return DAYS_OF_WEEK_SHORT[(index + dayOfWeek) % 7];
};

const indexToHour = (index) => {
  const today = new Date();
  const currHour = today.getHours();
  const futureHour = (currHour + index) % 24;
  if (futureHour === 0) {
    return '12am';
  }
  return futureHour > 12 ? `${futureHour - 12}pm` : `${futureHour}am`;
};

module.exports = {
  tempToText: tempToText,
  indexToDay: indexToDay,
  indexToHour: indexToHour,
};
