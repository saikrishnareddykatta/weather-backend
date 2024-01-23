const axios = require("axios");
const { validateTwoFactor } = require("../../utils/helper");

const verifyingTwoFactor = async (req, res) => {
  const { username, code } = req.body;
  try {
    const response = await axios.get(
      `${process.env.CSP_ENDPOINT_URL}`,
      { data: { username, functionType: "verifyTwoAuth" } },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      const { operation, message } = response.data;
      const { secret, twoFactorEnabled } = response.data.user;
      const is2FAValid = validateTwoFactor(code, secret);
      if (is2FAValid) {
        res.status(200).json({
          operation,
          message,
          user: {
            username,
            twoFactorEnabled,
          },
        });
      } else {
        res
          .status(401)
          .json({ errorMessage: "2FA Verification Failed, Please try again" });
      }
    } else {
      res.status(404).json({ errorMessage: "User is not found" });
    }
  } catch (error) {
    return res.status(500).json({
      errorMessage: "Verifying User 2FA API failed due to Internal Error",
      error,
    });
  }
};

module.exports = {
  verifyingTwoFactor,
};
