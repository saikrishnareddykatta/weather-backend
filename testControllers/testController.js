const { generateToken } = require("../utils/helper");

// Sample user data
// const users = [
//   { id: 1, name: "John Dobbs", age: 25 },
//   { id: 2, name: "Jane Smith", age: 30 },
//   { id: 3, name: "Bob Johnson", age: 40 },
// ];

const testUser = (req, res) => {
  const { ...payload } = req.body;
  const token = generateToken(payload);
  res.cookie("jwt", token, { httpOnly: true });
  return res.json({ message: "user is authorized" });
};

module.exports = {
  testUser,
};
