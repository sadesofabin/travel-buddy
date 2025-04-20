const express = require("express");

const locationRoutes = require("./location.route");
const router = express.Router();

router.use("/location", locationRoutes);

module.exports = router;
