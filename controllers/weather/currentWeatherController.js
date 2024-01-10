const { getCoordinates, getCurrentWeather } = require("../../utils/apiHelper");
const { currentWeatherResponse } = require("../../utils/responseHelper");

const currentWeather = async (req, res) => {
  try {
    const response = await getCoordinates(req, res);
    if (response.status === 200) {
      const { lat, lng } = response.data;
      const currentResponse = await getCurrentWeather(lat, lng);
      if (currentResponse.status === 200) {
        const { data } = currentResponse;
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

module.exports = {
  currentWeather,
};
