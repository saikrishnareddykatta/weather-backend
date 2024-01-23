// Importing necessary modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoute = require("./routes/authRoute");
const weatherRoute = require("./routes/weatherRoute");
const testRoute = require("./routes/testRoute");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleWare = require("./middleware/error-handler");

// Creating an Express application
const app = express();
const port = 8000;

// Middleware setup
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());

// Routes Middleware
app.use("/api/v1/testRoute", testRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/weather", weatherRoute);

// Error Handling Middleware
app.use("*", notFound); // Routes to Not Found when unhandled route is entered
app.use(errorHandlerMiddleWare); // Default Error Hanlders are need to written at the end of middleware function stack

// Start the server
app.listen(port, () => {
  console.log(`Server is Up and Running`);
});
