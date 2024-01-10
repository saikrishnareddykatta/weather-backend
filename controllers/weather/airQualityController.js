const { getCoordinates, getAirQuality } = require("../../utils/apiHelper");
const { airQualityWeatherResponse } = require("../../utils/responseHelper");

const airQuality = async (req, res) => {
  try {
    const response = await getCoordinates(req, res);
    if (response.status === 200) {
      const { lat, lng } = response.data;
      const airQualityResponse = await getAirQuality(lat, lng);
      if (airQualityResponse.status === 200) {
        const { data } = airQualityResponse;
        // need to add a helper function to format the data
        const formattedAQData = airQualityWeatherResponse(data);
        res.status(200).json(formattedAQData);
      } else {
        const { status, errorMessage } = airQualityResponse;
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
  airQuality,
};
