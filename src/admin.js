require("module-alias/register");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db-connect");
const {
  errorHandler,
  badRequestHandler,
  notFoundHandler,
} = require("./helpers/errorHandler");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const initServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log("info", `Admin Started at PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Error Starting Server:", error);
  }
};

connectDB();
initServer();

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);
app.use(badRequestHandler);
app.use(errorHandler);
