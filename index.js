// Importing necessary modules
const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();
const qrcode = require("qrcode");
const { authenticator } = require("otplib");

// Creating an Express application
const app = express();
const port = 8000;

// Sample user data
const users = [
  { id: 1, name: "John Doe", age: 25 },
  { id: 2, name: "Jane Smith", age: 30 },
  { id: 3, name: "Bob Johnson", age: 40 },
];

// generating QR code
const generateQRCode = async (username, secret) => {
  try {
    const uri = authenticator.keyuri(username, "Weather Vue Hub", secret);
    const qrImage = await qrcode.toDataURL(uri);
    const response = {
      success: true,
      tempSecret: secret,
      qrImage,
    };
    return response;
  } catch (error) {
    const response = {
      success: false,
      message: error.message,
      error,
    };
    return response;
  }
};

// validating 2FA code and secret
const validateTwoFactor = (code, secret) => {
  return authenticator.check(code, secret);
};

// hashing the password
async function hashPassword(password) {
  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
  return await bcrypt.hash(password, saltRounds);
}

async function authenticateUser(userPassword, hashedPassword) {
  try {
    const passwordMatch = await bcrypt.compare(userPassword, hashedPassword);
    return passwordMatch;
  } catch (error) {
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
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const secret = authenticator.generateSecret();
    const qrResponse = await generateQRCode(req.body.username, secret);
    if (qrResponse.success) {
      const { tempSecret, qrImage } = qrResponse;
      const payload = {
        ...req.body,
        password: hashedPassword,
        secret: "",
        tempSecret,
        twoFactorEnabled: false,
        functionType: "register",
      };
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
        const { operation, message } = response.data;
        const { username, id } = response.data.item;
        res.json({
          operation,
          message,
          user: {
            username,
            id,
            qrImage,
          },
        });
      } else {
        res.status(response.status).json({
          errorMessage:
            "Unable to Register the User. API Failed due to Internal Error",
        });
      }
    } else {
      res.status(500).json({
        errorMessage: qrResponse.message,
        error: qrResponse.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message
        ? error.message
        : "Register User API Failed due to Internal Error",
      error: error,
    });
  }
});

app.post("/setuptwofactor", async (req, res) => {
  const { username, code } = req.body;
  try {
    const tempSecretResponse = await axios.get(
      `${process.env.CSP_ENDPOINT_URL}`,
      { data: { username, functionType: "getTwoFactorSecret" } },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (tempSecretResponse.status === 200) {
      const { tempSecret } = tempSecretResponse.data.user;
      const isValidation = validateTwoFactor(code, tempSecret);
      if (isValidation) {
        const response = await axios.post(
          `${process.env.CSP_ENDPOINT_URL}`,
          {
            username,
            secret: tempSecret,
            tempSecret: "",
            twoFactorEnabled: true,
            functionType: "twoFactorSetup",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const { operation, message } = response.data;
          const { twoFactorEnabled } = response.data.user;
          res.status(200).json({
            operation,
            message,
            user: {
              username,
              twoFactorEnabled,
            },
          });
        } else {
          res.status(403).json({ errorMessage: "Unable to save the 2FA data" });
        }
      } else {
        res
          .status(402)
          .json({ errorMessage: "Please enter the Valid 2FA code" });
      }
    } else {
      res.status(tempSecretResponse.status).json({
        errorMessage:
          "Unable to Setup 2FA for the user. Please try after sometime",
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Setting User 2FA API Failed due to Internal Error",
      error,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await axios.get(
      `${process.env.CSP_ENDPOINT_URL}`,
      { data: { username, functionType: "login" } },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      const { operation, message } = response.data;
      const { twoFactorEnabled, tempSecret } = response.data.user;
      const hashedValue = response.data.user.password;
      const comparedValue = await authenticateUser(password, hashedValue);
      if (comparedValue) {
        if (twoFactorEnabled) {
          res.status(200).json({
            operation,
            message,
            user: {
              username,
              twoFactorEnabled,
              qrImage: false,
            },
          });
        } else {
          const qrResponse = await generateQRCode(username, tempSecret);
          if (qrResponse.success) {
            const { qrImage } = qrResponse;
            res.status(200).json({
              operation,
              message,
              user: {
                username,
                twoFactorEnabled,
                qrImage,
              },
            });
          } else {
            const { message, error } = qrResponse;
            res.status(500).json({
              errorMessage: message,
              error,
            });
          }
        }
      } else {
        res.status(401).json({ errorMessage: "Invalid Credentials" });
      }
    } else {
      res.status(404).json({ errorMessage: "User is not found" });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Login User API failed due to Internal Error",
      error,
    });
  }
});

app.post("/verifytwoauth", async (req, res) => {
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
    res.status(500).json({
      errorMessage: "Verifying User 2FA API failed due to Internal Error",
      error,
    });
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
  console.log(`Server is Up and Running`);
});
