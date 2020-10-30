const axios = require("axios");
const { WEATHER_API_KEY, LOCATION } = require("../../../apiKeys");

const getWeatherData = async () => {
  const config = {
    method: "get",
    url: `https://api.openweathermap.org/data/2.5/onecall?lat=${LOCATION.LAT}&lon=${LOCATION.LONG}&units=metric&appid=${WEATHER_API_KEY}`,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  getWeatherData: getWeatherData,
};
