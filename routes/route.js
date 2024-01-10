const router = require("express").Router();

const { login } = require("../controllers/auth/loginController");
const { register } = require("../controllers/auth/registerController");
const { setupTwoFactor } = require("../controllers/auth/setupTwoFAController");
const {
  verifyingTwoFactor,
} = require("../controllers/auth/verifyTwoFAController");
const {
  currentWeather,
  forecastWeather,
} = require("../controllers/weather/weatherController");
const { marineWeather } = require("../controllers/weather/marineController");
const { verifyToken } = require("../middleware/verifyToken");

/** HTTP Reqeusts */
router.post("/userlogin", login);
router.post("/registeruser", register);
router.post("/setuptwofactor", verifyToken, setupTwoFactor);
router.post("/verifytwoauth", verifyToken, verifyingTwoFactor);
router.post("/currentWeather", verifyToken, currentWeather);
router.post("/forecastWeather", verifyToken, forecastWeather);
router.post("/marineWeather", verifyToken, marineWeather);

module.exports = router;
