const router = require("express").Router();

// Controllers
const { testUser } = require("../testControllers/testController");
const { testUserV2 } = require("../testControllers/testControllerV2");

// Middleware
const { verifyToken } = require("../middleware/verify-token");
const { validateWeatherRequest } = require("../middleware/validate-request");

// Routes
router.post("/v1", testUser);
router.post("/v2", verifyToken, validateWeatherRequest, testUserV2);

// Exporting Router
module.exports = router;
