const axios = require("axios");
const {
  getCoordinates,
  getCurrentWeather,
  getForecastWeather,
} = require("../../utils/apiHelper");
const {
  currentWeatherResponse,
  forecastWeatherResponse,
} = require("../../utils/responseHelper");

const currentWeather = async (req, res) => {
  try {
    const response = await getCoordinates(req, res);
    if (response.status === 200) {
      const { lat, lng } = response.data;
      const currentResponse = await getCurrentWeather(lat, lng);
      if (currentResponse.status === 200) {
        const { data } = currentResponse;
        // need to add a helper function to format the data
        const weatherResponse = currentWeatherResponse(data);
        res.status(200).json(weatherResponse);
      } else {
        const { status, errorMessage } = currentResponse;
        res.status(status).json({
          errorMessage,
        });
      }
    } else {
      const { status, errorMessage } = response;
      res.status(status).json({
        errorMessage,
      });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal Server Issue", error });
  }
};

const forecastWeather = async (req, res) => {
  try {
    const response = await getCoordinates(req, res);
    if (response.status === 200) {
      const { lat, lng } = response.data;
      const forecastResponse = await getForecastWeather(lat, lng);
      if (forecastResponse.status === 200) {
        const { data } = forecastResponse;
        // need to add a helper function to format the data
        const forecastMutipleHoursResponse = forecastWeatherResponse(data);
        return res.status(200).json(forecastMutipleHoursResponse);
      } else {
        const { status, errorMessage } = forecastResponse;
        res.status(status).json({
          errorMessage,
        });
      }
    } else {
      const { status, errorMessage } = response;
      res.status(status).json({
        errorMessage,
      });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal Server Issue", error });
  }
};

module.exports = {
  currentWeather,
  forecastWeather,
};
