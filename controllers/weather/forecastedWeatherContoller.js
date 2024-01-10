const { getCoordinates, getForecastWeather } = require("../../utils/apiHelper");
const { forecastWeatherResponse } = require("../../utils/responseHelper");

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
  forecastWeather,
};
