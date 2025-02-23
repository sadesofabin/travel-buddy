const express = require("express");
const router = express.Router();
const { getLocationByCoordinates, nearByLocations, nearByHotels } = require("../controllers/locationController");

router.get("/getLocationByCoordinates", getLocationByCoordinates);
router.get("/nearByLocations", nearByLocations);
router.get("/nearByHotels", nearByHotels);


module.exports = router;
