const axios = require("axios");
const bcrypt = require("bcrypt");
const { authenticator } = require("otplib");
const { generateQRCode, generateToken } = require("../../utils/helper");

const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
  return await bcrypt.hash(password, saltRounds);
};

const register = async (req, res) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const { name, username, email } = req.body;
    const userDetails = { name, username, email };
    const secret = authenticator.generateSecret();
    const qrResponse = await generateQRCode(req.body.username, secret);
    if (qrResponse.success) {
      const { tempSecret, qrImage } = qrResponse;
      const payload = {
        ...req.body,
        password: hashedPassword,
        secret: "",
        tempSecret,
        twoFactorEnabled: false,
        functionType: "register",
      };
      const response = await axios.post(
        `${process.env.CSP_ENDPOINT_URL}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const token = generateToken(userDetails);
        const { operation, message } = response.data;
        const { username, id } = response.data.item;
        res.cookie("jwt", token, { httpOnly: true });
        res.json({
          operation,
          message,
          user: {
            username,
            id,
            qrImage,
          },
        });
      } else {
        res.status(response.status).json({
          errorMessage:
            "Unable to Register the User. API Failed due to Internal Error",
        });
      }
    } else {
      res.status(500).json({
        errorMessage: qrResponse.message,
        error: qrResponse.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message
        ? error.message
        : "Register User API Failed due to Internal Error",
      error: error,
    });
  }
};

module.exports = {
  register,
};
