// Importing necessary modules
const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();
const saltRounds = 10;

// Creating an Express application
const app = express();
const port = 8000;

// Sample user data
const users = [
  { id: 1, name: "John Doe", age: 25 },
  { id: 2, name: "Jane Smith", age: 30 },
  { id: 3, name: "Bob Johnson", age: 40 },
];

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function authenticateUser(userPassword, hashedPassword) {
  try {
    const passwordMatch = await bcrypt.compare(userPassword, hashedPassword);
    return passwordMatch;
  } catch (error) {
    console.error("Password comparison error:", error);
    return error;
  }
}

// Use the cors middleware
// app.use(cors());
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    // origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());

// Define a route to handle GET and POST requests
app.get("/test-users", (req, res) => {
  res.json(users);
});

app.post("/register", async (req, res) => {
  const payload = { ...req.body };
  const hashedPassword = await hashPassword(req.body.password);
  payload.password = hashedPassword;
  try {
    const response = await axios.post(
      `${process.env.CSP_ENDPOINT_URL}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      const { username } = response.data.item;
      res.json({ username });
    } else {
      res
        .status(response.status)
        .json({ error: "API Failed due to some issue" });
    }
  } catch (error) {
    res.status(500).json({ error: error, message: error?.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await axios.get(
      `${process.env.CSP_ENDPOINT_URL}`,
      { data: { username } },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      const hashedValue = response.data.user.password;
      const comparedValue = await authenticateUser(password, hashedValue);
      if (comparedValue) {
        res.status(200).json({ message: "Login is successful", username });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    } else {
      res.status(404).json({ message: "User is not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(users);
  }
});

app.get("/city", async (req, res) => {
  try {
    const { cityName, countryName } = req.query;
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?key=${process.env.GEO_API_KEY}&q=${cityName},+${countryName}&limit=1&pretty=1`
    );
    if (response.status === 200) {
      const geoLocations = response.data.results[0].geometry;
      const { lat, lng } = geoLocations;
      console.log("***openCageResponse", response.data.results[0].geometry);
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&limit=1&units=metric&appid=${process.env.WEATHER_API_KEY}`
      );
      if (geoResponse.status === 200) {
        console.log("***geoResponse", geoResponse.data);
        res.status(200).json(geoResponse.data);
      } else {
        console.log("***geoResponse API Failed", geoResponse);
        res.status(500).json({ error: "Internal Server Issue" });
      }
    } else {
      console.log("***Opencagedata API Failed");
      res.status(500).json({ error: "Opencagedata API Failed" });
    }
  } catch (error) {
    console.error("***Error fetching external API data:", error.message);
    res.status(500).json({ error: "Internal Server Issue" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`***Server is listening at http://localhost:${port}`);
});
