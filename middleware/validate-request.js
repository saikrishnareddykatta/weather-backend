const validateLoginRequest = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).json({ errorMessage: "Error in the Payload!!!" });
  } else {
    next();
  }
};

const validateRegisterRequest = (req, res, next) => {
  const { id, name, username, email, password } = req.body;
  if (!id || !name || !username || !email || !password) {
    return res.status(401).json({ errorMessage: "Error in the Payload!!!" });
  } else {
    next();
  }
};

const validateTwoFactorRequest = (req, res, next) => {
  const { username, code } = req.body;
  if (!username || !code) {
    return res.status(401).json({ errorMessage: "Error in the Payload!!!" });
  } else {
    next();
  }
};

const validateWeatherRequest = (req, res, next) => {
  const { cityName, countryName } = req.body;
  if (!cityName || !countryName) {
    return res.status(401).json({ errorMessage: "Error in the Payload!!!" });
  } else {
    next();
  }
};

module.exports = {
  validateLoginRequest,
  validateRegisterRequest,
  validateTwoFactorRequest,
  validateWeatherRequest,
};
