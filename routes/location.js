const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middlewares");

const { getLocationByCoordinates, nearByLocations, nearByHotels , getAllLocations, createLocation, } = require("../controllers/locationController");

router.get("/getLocationByCoordinates", getLocationByCoordinates);
router.get("/nearByLocations", nearByLocations);
router.get("/nearByHotels", nearByHotels);
router.get("/getAllLocations", getAllLocations );
router.post("/createLocation", upload.array("photos", 3), createLocation);



module.exports = router;
