const router = require("express").Router();

const { testUser } = require("../testControllers/testController");
const { testUserV2 } = require("../testControllers/testControllerV2");
const { verifyToken } = require("../middleware/verifyToken");

/** HTTP Reqeust */
router.post("/v1", testUser);
router.post("/v2", verifyToken, testUserV2);

module.exports = router;
