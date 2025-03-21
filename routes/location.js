const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middlewares");

const { getLocationByCoordinates, nearByLocations, nearByHotels , getAllLocations, createLocation, getAllHotels , createHotel} = require("../controllers/locationController");

router.get("/getLocationByCoordinates", getLocationByCoordinates);
router.get("/nearByLocations", nearByLocations);
router.get("/nearByHotels", nearByHotels);
router.get("/getAllLocations", getAllLocations );
router.post("/createLocation", upload.array("photos", 3), createLocation);
router.get("/getAllHotels", getAllHotels );
router.post("/createHotel", upload.array("photos", 3), createHotel);


module.exports = router;
