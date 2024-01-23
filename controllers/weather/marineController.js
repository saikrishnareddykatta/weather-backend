const { getCoordinates, getMarineWeather } = require("../../utils/apiHelper");
const { marineWeatherResponse } = require("../../utils/responseHelper");

const marineWeather = async (req, res) => {
  try {
    const response = await getCoordinates(req, res);
    if (response.status === 200) {
      const { geoLocations, timezone, cityComponents, formatted } =
        response.data;
      const { lat, lng } = geoLocations;
      const marineResponse = await getMarineWeather(lat, lng);
      if (marineResponse.status === 200) {
        const { data } = marineResponse;
        const formattedMarineData = marineWeatherResponse(
          data,
          timezone,
          cityComponents,
          formatted
        );
        res.status(200).json(formattedMarineData);
      } else {
        const { status, errorMessage } = marineResponse;
        res.status(status).json({
          errorMessage,
        });
      }
    } else {
      const { status, errorMessage } = response;
      return res.status(status).json({
        errorMessage,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Internal Server Issue", error });
  }
};

module.exports = {
  marineWeather,
};
