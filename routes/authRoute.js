const router = require("express").Router();

// Controllers
const { login } = require("../controllers/auth/loginController");
const { register } = require("../controllers/auth/registerController");
const { setupTwoFactor } = require("../controllers/auth/setupTwoFAController");
const {
  verifyingTwoFactor,
} = require("../controllers/auth/verifyTwoFAController");

// Middleware
const { verifyToken } = require("../middleware/verify-token");
const {
  validateLoginRequest,
  validateRegisterRequest,
  validateTwoFactorRequest,
} = require("../middleware/validate-request");

// Routes
router.post("/userlogin", validateLoginRequest, login);
router.post("/registeruser", validateRegisterRequest, register);
router.post(
  "/setuptwofactor",
  validateTwoFactorRequest,
  verifyToken,
  setupTwoFactor
);
router.post(
  "/verifytwoauth",
  validateTwoFactorRequest,
  verifyToken,
  verifyingTwoFactor
);

// Exporting Router
module.exports = router;
