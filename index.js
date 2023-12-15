// Importing necessary modules
const express = require("express");

// Creating an Express application
const app = express();
const port = 8000;

// Sample user data
const users = [
  { id: 1, name: "John Doe", age: 25 },
  { id: 2, name: "Jane Smith", age: 30 },
  { id: 3, name: "Bob Johnson", age: 40 },
];

// Define a route to handle GET requests
app.get("/users", (req, res) => {
  // Sending the user data as JSON
  res.json(users);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
