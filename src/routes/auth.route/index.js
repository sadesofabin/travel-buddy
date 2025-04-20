const express = require("express");

const authRoutes = require("./authRoute");

const router = express.Router();

router.use("/login", authRoutes);


module.exports = router;
