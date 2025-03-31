require("module-alias/register");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db-connect");
const routes = require("./routes/user.route/index");
const {
  errorHandler,
  badRequestHandler,
  notFoundHandler,
} = require("./helpers/errorHandler");

const app = express();
const PORT = process.env.PORT || 5002; // Define PORT properly

app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Start the Server
const initServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log("info", `User Started at PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Error Starting Server:", error);
  }
};

// Connect to DB and start the server
connectDB();
initServer();

app.use("/api", routes);

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error Handlers
app.use(notFoundHandler);
app.use(badRequestHandler);
app.use(errorHandler);
