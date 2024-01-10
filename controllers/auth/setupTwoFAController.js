const axios = require("axios");
const { validateTwoFactor } = require("../../utils/helper");

const setupTwoFactor = async (req, res) => {
  const { username, code } = req.body;
  try {
    const tempSecretResponse = await axios.get(
      `${process.env.CSP_ENDPOINT_URL}`,
      { data: { username, functionType: "getTwoFactorSecret" } },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (tempSecretResponse.status === 200) {
      const { tempSecret } = tempSecretResponse.data.user;
      const isValidation = validateTwoFactor(code, tempSecret);
      if (isValidation) {
        const response = await axios.post(
          `${process.env.CSP_ENDPOINT_URL}`,
          {
            username,
            secret: tempSecret,
            tempSecret: "",
            twoFactorEnabled: true,
            functionType: "twoFactorSetup",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const { operation, message } = response.data;
          const { twoFactorEnabled } = response.data.user;
          res.status(200).json({
            operation,
            message,
            user: {
              username,
              twoFactorEnabled,
            },
          });
        } else {
          res.status(403).json({ errorMessage: "Unable to save the 2FA data" });
        }
      } else {
        res
          .status(402)
          .json({ errorMessage: "Please enter the Valid 2FA code" });
      }
    } else {
      res.status(tempSecretResponse.status).json({
        errorMessage:
          "Unable to Setup 2FA for the user. Please try after sometime",
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Setting User 2FA API Failed due to Internal Error",
      error,
    });
  }
};

module.exports = {
  setupTwoFactor,
};
