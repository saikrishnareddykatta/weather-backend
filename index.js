// Importing necessary modules
const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Import the 'cors' middleware
require("dotenv").config();

// Creating an Express application
const app = express();
const port = 8000;

// Sample user data
const users = [
  { id: 1, name: "John Doe", age: 25 },
  { id: 2, name: "Jane Smith", age: 30 },
  { id: 3, name: "Bob Johnson", age: 40 },
];

// Use the cors middleware
app.use(cors());
app.use(express.json());

// Define a route to handle GET and POST requests
app.get("/test-users", (req, res) => {
  const { cityName, countryName } = req.query;
  console.log("***Query parameters", cityName, countryName);
  res.json(users);
});

app.post("/register", async (req, res) => {
  const payload = { ...req.body };
  try {
    const response = await axios.post(
      `${process.env.REGISTER_USER_URL}`,
      payload
    );
    if (response.status === 200) {
      const data = response.data.item;
      res.json(data);
    } else {
      res
        .status(response.status)
        .json({ error: "API Failed due to some issue" });
    }
  } catch (error) {
    res.status(500).json({ error: error, message: error?.message });
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
