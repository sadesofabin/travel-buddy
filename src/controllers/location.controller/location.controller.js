const catchAsync = require("../../helpers/catchAsync");
const {
  getAllLocationService,
  getLocationService,
  nearByLocationsService,
  nearByHotelsService,
  getLocationByslugService
} = require("../../services/location.services/location.services");

const getAllLocations = catchAsync(async (req, res) => {
  const { limit, page, state, district, terrain, lat, long } = req.query;
  const data = { limit, page, state, district, terrain, lat, long };
  const locations = await getAllLocationService(data);
  res.status(200).json({ sucess: true, status: 200, locations });
});

const getLocations = catchAsync(async (req, res) => {
  const { limit, page, homeType } = req.query;
  const data = { limit, page, homeType };
  const locations = await getLocationService(data);
  res.status(200).json({ sucess: true, status: 200, locations });
});

const nearByLocations = catchAsync(async (req, res) => {
  const { limit, page, lng, lat } = req.query;
  const data = { limit, page, lng, lat };
  const locations = await nearByLocationsService(data);
  res.status(200).json({ sucess: true, status: 200, locations });
});

const nearByHotels = catchAsync(async (req, res) => {
  const { limit, page, lng, lat } = req.query;
  const data = { limit, page, lng, lat };
  const hotels = await nearByHotelsService(data);
  res.status(200).json({ sucess: true, status: 200, hotels });
});

const getLocationsBySlug = catchAsync(async (req, res) => {  
  const { slug } = req.params;
  const location = await getLocationByslugService(slug);
  res.status(200).json({ sucess: true, status: 200, location });
});


module.exports = {
  getAllLocations,
  getLocations,
  nearByLocations,
  nearByHotels,
  getLocationsBySlug
};
