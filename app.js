// Importing necessary modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const appRoute = require("./routes/route");
const testRoute = require("./routes/testRoute");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleWare = require("./middleware/error-handler");

// Creating an Express application
const app = express();
const port = 8000;

// Use the cors middleware
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    // origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use("/testRoute", testRoute);
app.use("/weather", appRoute);
app.use("*", notFound); // Routes to Not Found when unhandled route is entered
app.use(errorHandlerMiddleWare); // Default Error Hanlders are need to written at the end of middleware function stack

// Start the server
app.listen(port, () => {
  console.log(`Server is Up and Running`);
});
