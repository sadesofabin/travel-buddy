const express = require("express");
const router = express.Router();
const { getLocationByCoordinates, nearByLocations, nearByHotels , getAllLocations} = require("../controllers/locationController");

router.get("/getLocationByCoordinates", getLocationByCoordinates);
router.get("/nearByLocations", nearByLocations);
router.get("/nearByHotels", nearByHotels);
router.get("/getAllLocations", getAllLocations );



module.exports = router;
