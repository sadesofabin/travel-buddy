require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const connectDB = require("./config/db-connect");
const errorHandler = require("./helpers/errorHandler");
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/placeRoutes");
const locationRoutes = require("./routes/location");
const commentsRoutes = require("./routes/comments");
const adminRoutes = require("./routes/admin");
const wishlistRoutes = require("./routes/wishList");
const followerRoutes = require("./routes/follower");






const app = express();
app.use(express.json());
app.use(
    cors({
      origin: "*", // Allows all origins
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
      allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    })
  );

  
connectDB();
app.use("/api/admin", adminRoutes );
app.use("/src/uploads", express.static(path.resolve(__dirname, "uploads")));
app.use("/api/user", userRoutes);
app.use("/api/place", placeRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/wishList", wishlistRoutes)
app.use("/api/follower", followerRoutes)
app.get("/health", (req, res) => {
    res.status(200).json({
      status: "success",
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  });
  

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
