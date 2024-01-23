const axios = require("axios");
const bcrypt = require("bcrypt");
const { generateQRCode, generateToken } = require("../../utils/helper");

const authenticateUser = async (userPassword, hashedPassword) => {
  try {
    const passwordMatch = await bcrypt.compare(userPassword, hashedPassword);
    return passwordMatch;
  } catch (error) {
    return error;
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { ...payload } = req.body;
    const response = await axios.get(
      `${process.env.CSP_ENDPOINT_URL}`,
      { data: { username, functionType: "login" } },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      const { operation, message } = response.data;
      const { twoFactorEnabled, tempSecret } = response.data.user;
      const hashedValue = response.data.user.password;
      const comparedValue = await authenticateUser(password, hashedValue);
      const token = generateToken(payload);
      if (comparedValue) {
        if (twoFactorEnabled) {
          const halfHour = 1000 * 30 * 60;
          res.cookie("jwt", token, {
            httpOnly: true,
            expires: new Date(Date.now() + halfHour),
          });
          res.status(200).json({
            operation,
            message,
            user: {
              username,
              twoFactorEnabled,
              qrImage: false,
            },
          });
        } else {
          const qrResponse = await generateQRCode(username, tempSecret);
          if (qrResponse.success) {
            const { qrImage } = qrResponse;
            res.cookie("jwt", token, { httpOnly: true });
            res.status(200).json({
              operation,
              message,
              user: {
                username,
                twoFactorEnabled,
                qrImage,
              },
            });
          } else {
            const { message, error } = qrResponse;
            res.status(500).json({
              errorMessage: message,
              error,
            });
          }
        }
      } else {
        res.status(401).json({ errorMessage: "Invalid Credentials" });
      }
    } else {
      res.status(404).json({ errorMessage: "User is not found" });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Login User API failed due to Internal Error",
      error,
    });
  }
};

module.exports = {
  login,
};
