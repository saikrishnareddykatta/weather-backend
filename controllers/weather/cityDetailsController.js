const { getCityDetails } = require("../../utils/apiHelper");
const { cityDetailsResponse } = require("../../utils/responseHelper");

const cityDetails = async (req, res) => {
  try {
    const response = await getCityDetails(req, res);
    if (response.status === 200) {
      const cityResponse = response.data;
      const formattedCityResponse = cityDetailsResponse(cityResponse);
      res.status(200).json(formattedCityResponse);
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
  cityDetails,
};
