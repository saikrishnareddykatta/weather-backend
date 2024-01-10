const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.cookies.jwt || "";
  // If JWT is not found in cookies, check the Authorization header
  const authHeader = req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7); // Extract the token from the "Bearer " prefix
  }
  const secretKey = `${process.env.JWT_SECRET_KEY}`;
  const expectedIssuer = "https://localhost:8000";
  try {
    const options = {
      algorithms: "HS256",
      issuer: expectedIssuer,
    };
    const decodedToken = jwt.verify(token, secretKey, options);
    if (decodedToken) {
      next();
    } else {
      return res
        .status(401)
        .json({ errorMessage: "Required Authorized JWT token" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Unable to validate JWT token", error });
  }
};

module.exports = {
  verifyToken,
};
