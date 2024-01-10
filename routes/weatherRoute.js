const router = require("express").Router();

// Controllers
const {
  currentWeather,
} = require("../controllers/weather/currentWeatherController");
const {
  forecastWeather,
} = require("../controllers/weather/forecastedWeatherContoller");
const { marineWeather } = require("../controllers/weather/marineController");
const { airQuality } = require("../controllers/weather/airQualityController");

// Middleware
const { verifyToken } = require("../middleware/verify-token");
const { validateWeatherRequest } = require("../middleware/validate-request");

// Routes
router.post(
  "/currentWeather",
  validateWeatherRequest,
  verifyToken,
  currentWeather
);
router.post(
  "/forecastWeather",
  validateWeatherRequest,
  verifyToken,
  forecastWeather
);
router.post(
  "/marineWeather",
  validateWeatherRequest,
  verifyToken,
  marineWeather
);
router.post("/airQuality", validateWeatherRequest, verifyToken, airQuality);

// Exporting Router
module.exports = router;
