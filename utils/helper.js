const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");
const { authenticator } = require("otplib");

const generateToken = (payload) => {
  const secretKey = `${process.env.JWT_SECRET_KEY}`;
  const options = {
    expiresIn: "30m",
    algorithm: "HS256",
    issuer: "https://localhost:8000",
  };
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

const generateQRCode = async (username, secret) => {
  try {
    const uri = authenticator.keyuri(username, "Weather Vue Hub", secret);
    const qrImage = await qrcode.toDataURL(uri);
    const response = {
      success: true,
      tempSecret: secret,
      qrImage,
    };
    return response;
  } catch (error) {
    const response = {
      success: false,
      message: error.message,
      error,
    };
    return response;
  }
};

const validateTwoFactor = (code, secret) => {
  return authenticator.check(code, secret);
};

module.exports = {
  generateToken,
  generateQRCode,
  validateTwoFactor,
};
