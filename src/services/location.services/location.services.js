const {
  getAllLocations,
  getLocations,
  locationPagination,
  calculatePagination,
  nearByLocationPagination,
  nearByLocations,
  fetchRouteFromAPI,
  getRouteFromDB,
  saveRouteToDB,
  nearByHotels,
  nearByHotelsPagination,
  getAllLocationsBySlug
} = require("../../repository/location.repository/location.repository");

const getAllLocationService = async (data) => {
  const { page, limit, state, district, terrain, lat, long } = data;
  const orsApiKey = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;

  const query = {};
  if (state) query.state = state;
  if (district) query.district = district;
  if (terrain) query.terrain = terrain;

  const { totalLocations, totalPages, skip } = await calculatePagination(
    page,
    limit,
    query
  );
  const locations = await getAllLocations(skip, limit, query);

  if (locations.length === 0) {
    throw new Error("Location not found");
  }

  const enrichedLocations = await Promise.all(
    locations.map(async (loc) => {
      const currentLocation = [long, lat];
      const destination = [
        loc.location.coordinates[0],
        loc.location.coordinates[1],
      ];

      let routeData = await getRouteFromDB(currentLocation, destination);
      if (!routeData) {
        routeData = await fetchRouteFromAPI(
          currentLocation,
          destination,
          orsApiKey
        );
        if (!routeData.error) {
          await saveRouteToDB(currentLocation, destination, routeData);
        }
      }

      return {
        ...loc.toObject(),
        latitude: loc.location.coordinates[1],
        longitude: loc.location.coordinates[0],
        routeData,
      };
    })
  );

  return { totalLocations, totalPages, locations: enrichedLocations };
};

const getLocationService = async (data) => {
  const { page, limit, homeType } = data;

  const query = {};
  if (!!homeType) {
    query.homeType = homeType === "true";
  }

  const { totalLocations, totalPages, skip } = await locationPagination(
    page,
    limit,
    query
  );

  const locations = await getLocations(skip, limit, query);

  return { totalLocations, totalPages, locations };
};

const nearByLocationsService = async (data) => {
  const { page, limit, lng, lat } = data;
  const orsApiKey = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;

  let query = {
    lng,
    lat,
  };

  const { totalLocations, totalPages, skip } = await nearByLocationPagination(
    page,
    limit,
    query
  );

  const locations = await nearByLocations(skip, limit, query);

  if (locations.length === 0) {
    const error = new Error("Location not found");
    error.statusCode = 404;
    throw error;
  }

  const enrichedLocations = await Promise.all(
    locations.map(async (loc) => {
      const currentLocation = [lng, lat];
      const destination = [
        loc.location.coordinates[0],
        loc.location.coordinates[1],
      ];

      let routeData = await getRouteFromDB(currentLocation, destination);
      if (!routeData) {
        routeData = await fetchRouteFromAPI(
          currentLocation,
          destination,
          orsApiKey
        );
        if (!routeData.error) {
          await saveRouteToDB(currentLocation, destination, routeData);
        }
      }

      return {
        ...loc.toObject(),
        latitude: loc.location.coordinates[1],
        longitude: loc.location.coordinates[0],
        routeData,
      };
    })
  );
  return { totalLocations, totalPages, locations: enrichedLocations };
};

const nearByHotelsService = async (data) => {
  const { page, limit, lng, lat } = data;
  const orsApiKey = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;

  let query = {
    lng,
    lat,
  };

  const { totalLocations, totalPages, skip } = await nearByHotelsPagination(
    page,
    limit,
    query
  );

  const locations = await nearByHotels(skip, limit, query);

  if (locations.length === 0) {
    const error = new Error("Hotels not found");
    error.statusCode = 404;
    throw error;
  }

  const enrichedLocations = await Promise.all(
    locations.map(async (loc) => {
      const currentLocation = [lng, lat];
      const destination = [
        loc.location.coordinates[0],
        loc.location.coordinates[1],
      ];

      let routeData = await getRouteFromDB(currentLocation, destination);
      if (!routeData) {
        routeData = await fetchRouteFromAPI(
          currentLocation,
          destination,
          orsApiKey
        );
        if (!routeData.error) {
          await saveRouteToDB(currentLocation, destination, routeData);
        }
      }

      return {
        ...loc.toObject(),
        latitude: loc.location.coordinates[1],
        longitude: loc.location.coordinates[0],
        routeData,
      };
    })
  );
  return { totalLocations, totalPages, locations: enrichedLocations };
};

const getLocationByslugService = async (slug) => {
  return await getAllLocationsBySlug(slug);
};

module.exports = {
  getAllLocationService,
  getLocationService,
  nearByLocationsService,
  nearByHotelsService,
  getLocationByslugService,
};
