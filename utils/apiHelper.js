const axios = require("axios");

const getCoordinates = async (req, res) => {
  const { cityName, countryName } = req.body;
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?key=${process.env.GEO_API_KEY}&q=${cityName},+${countryName}&limit=1&pretty=1`
    );
    if (response.status === 200) {
      const geoLocations = response.data.results[0].geometry;
      return {
        status: 200,
        data: geoLocations,
      };
    } else {
      return {
        status: 500,
        errorMessage: "API Failed due to Internal Issues",
      };
    }
  } catch (error) {
    return {
      status: 404,
      errorMessage: "Unable to fetch the data from the API",
      error,
    };
  }
};

// returns the temp values in celcius
const getCurrentWeather = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`
    );
    if (response.status === 200) {
      const { data } = response;
      return {
        status: 200,
        data,
      };
    } else {
      return {
        status: 500,
        errorMessage: "API Failed due to Internal Issues",
      };
    }
  } catch (error) {
    return {
      status: 404,
      errorMessage: "Unable to fetch the data from the API",
      error,
    };
  }
};

const getForecastWeather = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=16&appid=${process.env.WEATHER_API_KEY}`
    );
    if (response.status === 200) {
      const { data } = response;
      return {
        status: 200,
        data,
      };
    } else {
      return {
        status: 500,
        errorMessage: "API Failed due to Internal Issues",
      };
    }
  } catch (error) {
    return {
      status: 404,
      errorMessage: "Unable to fetch the data from the API",
      error,
    };
  }
};

const getMarineWeather = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction,wind_wave_period,wind_wave_peak_period,swell_wave_height,swell_wave_direction,swell_wave_period,swell_wave_peak_period&timeformat=unixtime&forecast_days=1&models=best_match`
    );
    if (response.status === 200) {
      const { data } = response;
      return {
        status: 200,
        data,
      };
    } else {
      return {
        status: 500,
        errorMessage: "API failed due to Internal Issues",
      };
    }
  } catch (error) {
    return {
      status: 400,
      errorMessage: "No marine data is available for this location",
      error,
    };
  }
};

module.exports = {
  getCoordinates,
  getCurrentWeather,
  getForecastWeather,
  getMarineWeather,
};
