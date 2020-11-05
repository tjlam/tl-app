const cleanHourlyOrCurrentWeatherData = (data) => {
  if (!data) {
    return null;
  }

  return {
    temp: data.temp,
    feelsLike: data.feels_like,
    windSpeed: msTokmH(data.wind_speed),
    description: data.weather[0].description,
    main: data.weather[0].main,
    conditionId: data.weather[0].id,
    iconId: data.weather[0].icon,
    rain: data.rain,
    snow: data.snow,
    humidity: data.humidity,
    prob: data.pop,
  };
};

const cleanDailyWeatherData = (data) => {
  if (!data) {
    return null;
  }

  return {
    temp: data.temp.day,
    tempHigh: data.temp.max,
    tempLow: data.temp.min,
    feelsLike: data.feels_like.day,
    feelsLikeEve: data.feels_like.eve,
    feelsLikeMorn: data.feels_like.morn,
    feelsLikeNight: data.feels_like.night,
    windSpeed: msTokmH(data.wind_speed),
    description: data.weather[0].description,
    main: data.weather[0].main,
    conditionId: data.weather[0].id,
    iconId: data.weather[0].icon,
    rain: data.rain,
    snow: data.snow,
    humidity: data.humidity,
    prob: data.pop,
  };
};

const msTokmH = (metersPerSec) => {
  const kmh = metersPerSec * 3.6;
  return kmh.toFixed(1);
};

const cleanWeatherData = (data) => {
  if (!data) {
    return null;
  }
  const { current, daily, hourly } = data;
  const cleanedDaily = daily.map((dailyWeather) =>
    cleanDailyWeatherData(dailyWeather)
  );
  const cleanedHourly = hourly.map((hourlyWeather) =>
    cleanHourlyOrCurrentWeatherData(hourlyWeather)
  );
  const cleanedCurrent = cleanHourlyOrCurrentWeatherData(current);

  return {
    current: cleanedCurrent,
    daily: cleanedDaily,
    hourly: cleanedHourly,
  };
};

const tempToText = (temp) => {
  return `${Math.round(temp)}˚`;
};

const DAYS_OF_WEEK_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    return 12;
  }
  return futureHour > 12 ? futureHour - 12 : futureHour;
};

module.exports = {
  cleanWeatherData: cleanWeatherData,
  tempToText: tempToText,
  indexToDay: indexToDay,
  indexToHour: indexToHour,
};
