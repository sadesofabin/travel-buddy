const express = require("express");
const {
  getAllLocations,
  getLocations,
  nearByLocations,
  nearByHotels,
  getLocationsBySlug,
} = require("@controllers/location.controller/location.controller");
const router = express.Router();

router.get("/getAll", getAllLocations);
router.get("/get", getLocations);
router.get("/getNearBy", nearByLocations);
router.get("/getHotels", nearByHotels);
router.post("/getLoc/:slug", getLocationsBySlug);

module.exports = router;
