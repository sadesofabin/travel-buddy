const catchAsync = require("../helpers/catchAsync");
const { Location, Hotel } = require('../models/locationdata');
const axios = require("axios");


const getLocationByCoordinates = catchAsync(async (req, res) => {
  const { lat, long } = req.query;

  if (!lat || !long) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required." });
  }

  const location = await Location.findOne({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(long), parseFloat(lat)],
        },
        $maxDistance: 1000,
      },
    },
    isDeleted: false,
  });
  if (!location) {
    return res
      .status(404)
      .json({ message: "Location not found near these coordinates." });
  }
  res.status(200).json(location);
});

const nearByLocations = catchAsync(async (req, res) => {
    const { lat, lng, state, district, terrain, page = 1, limit = 20 } = req.query;
  
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "Latitude and Longitude are required." });
    }
  
    let query = {
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 3000,
        },
      },
      isDeleted: false,
    };
  
    
    if (state) query.state = state;
    if (district) query.district = district;
    if (terrain) query.terrain = terrain;
  
    const skip = (parseInt(page) - 1) * parseInt(limit);
  
    try {
      
      await Location.createIndexes({ location: "2dsphere" });
  
      const locations = await Location.find(query, {
        slug: 1,
        state: 1,
        district: 1,
        terrain: 1,
        placeName: 1,
        description: 1,
        location: 1,
        title: 1,
        rating: 1,
        photos: 1,
      })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();
  
      if (!locations || locations.length === 0) {
        return res.status(404).json({ success: false, message: "No nearby locations found." });
      }
  
      res.status(200).json({
        success: true,
        count: locations.length,
        page: parseInt(page),
        data: locations,
      });
    } catch (error) {
      console.error("Error fetching nearby locations:", error);
      res.status(500).json({ success: false, message: "Server error", error });
    }
  });
  


  const nearByHotels = async (req, res) => {
    try {
      const { lat, lng, page = 1, limit = 10 } = req.query;
    
      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          message: "Latitude and Longitude are required.",
        });
      }
  
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
  
      const hotels = await Hotel.find({
        location: {
          $geoWithin: {
            $centerSphere: [[parseFloat(lng), parseFloat(lat)], 30 / 6378.1], // 30km radius
          },
        },
        isDeleted: false,
      })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);
  
      const totalCount = await Hotel.countDocuments({
        location: {
          $geoWithin: {
            $centerSphere: [[parseFloat(lng), parseFloat(lat)], 30 / 6378.1],
          },
        },
        isDeleted: false,
      });
  
      res.status(200).json({
        success: true,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalResults: totalCount,
        hotels,
      });
    } catch (error) {
      console.error("Error fetching hotels:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  



module.exports = {
  getLocationByCoordinates, nearByLocations,  nearByHotels
};
