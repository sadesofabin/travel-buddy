const catchAsync = require("../helpers/catchAsync");
const { Location, Hotel } = require("../models/locationdata");
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
  const {
    lat,
    lng,
    state,
    district,
    terrain,
    page = 1,
    limit = 20,
  } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: "Latitude and Longitude are required.",
    });
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
      return res
        .status(404)
        .json({ success: false, message: "No nearby locations found." });
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

const getAllLocations = catchAsync(async (req, res) => {
  const { state, district, pageSize, pageNumber } = req.query;

  // Parse pagination values
  const parsedPageSize = parseInt(pageSize) || 1000;
  const parsedPageNumber = parseInt(pageNumber) || 1;

  // Initialize the query object
  let query = { isDeleted: false };

  // Add filtering based on state, district, and terrain if provided
  if (state) {
    query.state = state;
  }

  if (district) {
    query.district = district;
  }

  // Calculate pagination
  const totalLocations = await Location.countDocuments(query); // Ensure you're filtering by query
  const totalPages = Math.ceil(totalLocations / parsedPageSize);
  const skip = (parsedPageNumber - 1) * parsedPageSize;

  // Fetch the locations with pagination applied
  const locations = await Location.find(query).skip(skip).limit(parsedPageSize);

  return res.status(200).json({
    success: true,
    data: locations,
    totalLocations,
    totalPages,
    pageSize: parsedPageSize,
    pageNumber: parsedPageNumber,
  });
});

const createLocation = catchAsync(async (req, res) => {
  const {
    slug,
    state,
    district,
    lat,
    lng,
    terrain,
    title,
    placeName,
    description,
    rating = 0,
    resource,
    metaTitle,
    metaDescription,
  } = req.body;

  if (
    !slug ||
    !state ||
    !district ||
    !lat ||
    !lng ||
    !terrain ||
    !title ||
    !placeName
  ) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided.",
    });
  }

  const location = {
    type: "Point",
    coordinates: [parseFloat(lng), parseFloat(lat)],
  };

  let photos = [];
  if (req.files && req.files.length > 0) {
    photos = req.files.map((file) => file.filename);
  }

  const newLocation = new Location({
    slug,
    state,
    district,
    location,
    terrain,
    title,
    placeName,
    description,
    rating,
    photos,
    resource,
    metaTitle,
    metaDescription,
  });

  await newLocation.save();

  return res.status(201).json({
    success: true,
    message: "Location created successfully.",
    data: newLocation,
  });
});

const getAllHotels = catchAsync(async (req, res) => {
  const { state, district, pageSize, pageNumber } = req.query;

  // Parse pagination values
  const parsedPageSize = parseInt(pageSize) || 100;
  const parsedPageNumber = parseInt(pageNumber) || 1;

  // Initialize the query object for filtering hotels by state and district (optional)
  let query = { isDeleted: false };

  if (state) {
    query.state = state;
  }

  if (district) {
    query.district = district;
  }

  // Calculate pagination
  const totalHotels = await Hotel.countDocuments(query); // Ensure you're filtering by query
  const totalPages = Math.ceil(totalHotels / parsedPageSize);
  const skip = (parsedPageNumber - 1) * parsedPageSize;

  // Fetch the hotels with pagination applied
  const hotels = await Hotel.find(query).skip(skip).limit(parsedPageSize);

  return res.status(200).json({
    success: true,
    totalHotels,
    totalPages,
    pageSize: parsedPageSize,
    pageNumber: parsedPageNumber,
    hotels,
  });
});

// Create a hotel
const createHotel = catchAsync(async (req, res) => {
  const {
    name,
    slug,
    type,
    latitude,
    longitude,
    state,
    district,
    address,
    description,
    rating = 0,
    photos = [],
    rooms = [],
    amenities = [],
    contactInfo,
    metaTitle,
    metaDescription,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !slug ||
    !type ||
    !latitude ||
    !longitude ||
    !state ||
    !district ||
    !address ||
    !description
  ) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided.",
    });
  }

  // Create the location object with coordinates as [longitude, latitude]
  const location = {
    type: "Point",
    coordinates: [parseFloat(longitude), parseFloat(latitude)], // Ensure lat and lng are numbers
  };

  // Create a new hotel
  const newHotel = new Hotel({
    name,
    slug,
    type,
    location,
    state,
    district,
    address,
    description,
    rating,
    photos,
    rooms,
    amenities,
    contactInfo,
    metaTitle,
    metaDescription,
  });

  // Save the hotel to the database
  await newHotel.save();

  return res.status(201).json({
    success: true,
    message: "Hotel created successfully.",
    data: newHotel,
  });
});

const cleanObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
};

const updateLocationById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const cleanBody = cleanObject(req.body);

  if (cleanBody.lat && cleanBody.lng) {
    cleanBody.location = {
      type: "Point",
      coordinates: [parseFloat(cleanBody.lng), parseFloat(cleanBody.lat)],
    };
  }

  let photos = [];
  if (req.files && req.files.length > 0) {
    photos = req.files.map((file) => file.filename);

    const location = await Location.findById(id);
    if (location && location.photos && location.photos.length > 0) {
      location.photos.forEach((oldPhoto) => {
        const oldPhotoPath = path.join(__dirname, "src/uploads", oldPhoto);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      });
    }
  }

  if (photos.length === 0 && cleanBody.photos === undefined) {
    const location = await Location.findById(id);
    photos = location.photos || [];
  }

  cleanBody.photos = photos;

  const updatedLocation = await Location.findByIdAndUpdate(id, cleanBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedLocation) {
    return res
      .status(404)
      .json({ success: false, message: "Location not found." });
  }

  return res.status(200).json({
    success: true,
    message: "Location updated successfully.",
    data: updatedLocation,
  });
});

const getAllLocationsBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params; // Get slug from URL params

  // Initialize the query object
  let query = { isDeleted: false };

  // Add filtering based on slug
  if (slug) {
    query.slug = slug;
  }

  // Fetch the locations
  const locations = await Location.find(query);

  return res.status(200).json({
    success: true,
    data: locations,
  });
});

module.exports = {
  getLocationByCoordinates,
  nearByLocations,
  nearByHotels,

  getAllLocations,
  createLocation,
  getAllHotels,
  createHotel,
  updateLocationById,
  getAllLocationsBySlug,
};
