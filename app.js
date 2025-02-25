require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db-connect");
const errorHandler = require("./helpers/errorHandler");
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/placeRoutes");
const locationRoutes = require("./routes/location");
const commentsRoutes = require("./routes/comments");
const adminRoutes = require("./routes/admin");




const app = express();
app.use(express.json());
app.use(cors());

connectDB();
app.use("/api/admin", adminRoutes );
app.use("/api/user", userRoutes);
app.use("/api/place", placeRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/comments", commentsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
