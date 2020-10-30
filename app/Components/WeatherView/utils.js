const cleanWeatherDataPerTimeUnit = (data) => {
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
    cleanWeatherDataPerTimeUnit(dailyWeather)
  );
  const cleanedHourly = hourly.map((hourlyWeather) =>
    cleanWeatherDataPerTimeUnit(hourlyWeather)
  );
  const cleanedCurrent = cleanWeatherDataPerTimeUnit(current);

  return {
    current: cleanedCurrent,
    daily: cleanedDaily,
    hourly: cleanedHourly,
  };
};

module.exports = {
  cleanWeatherData: cleanWeatherData,
};
