// Sample user data
// const users = [
//   { id: 1, name: "John Dobbs", age: 25 },
//   { id: 2, name: "Jane Smith", age: 30 },
//   { id: 3, name: "Bob Johnson", age: 40 },
// ];

const testUserV2 = (req, res) => {
  return res.status(200).json({ message: "verification is succesful" });
};

module.exports = {
  testUserV2,
};
