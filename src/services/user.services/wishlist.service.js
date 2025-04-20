const {
  addToWishlist,
  wishlisted,
  getWishilistById,
  calculatePagination,
} = require("../../repository/user.repository/wishlist.repository");

const {
  getRouteFromDB,
  fetchRouteFromAPI,
  saveRouteToDB,
} = require("../../repository/location.repository/location.repository");

const orsApiKey = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;

const addToWishlistService = async (data) => {
  const responce = await addToWishlist(data);

  if (responce === "USERNOTFOUND") {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (responce === "LOCATIONNOTFOUND") {
    const error = new Error("Location not found");
    error.statusCode = 404;
    throw error;
  }

  return responce;
};

const wishlistedService = async (userId, locationId) => {
  const responce = await wishlisted(userId, locationId);

  if (responce === "USERNOTFOUND") {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (responce === "LOCATIONNOTFOUND") {
    const error = new Error("Location not found");
    error.statusCode = 404;
    throw error;
  }

  return responce;
};

const getWishilistByIdService = async (page, limit, userId, lat, long) => {
  const { totalLocations, totalPages, skip } = await calculatePagination(
    page,
    limit,
    userId
  );
  const responce = await getWishilistById(skip, limit, userId);

  if (responce === "USERNOTFOUND") {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (responce === "NOTFOUND") {
    const error = new Error("Wishlist not found");
    error.statusCode = 404;
    throw error;
  }
  const enrichedLocations = await Promise.all(
    responce.map(async (loc) => {
      const currentLocation = [long, lat];
      const destination = [
        loc.locationId.location.coordinates[0],
        loc.locationId.location.coordinates[1],
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
        latitude: loc.locationId.location.coordinates[1],
        longitude: loc.locationId.location.coordinates[0],
        routeData,
      };
    })
  );

  return { totalLocations, totalPages, skip, responce: enrichedLocations };
};

module.exports = {
  addToWishlistService,
  wishlistedService,
  getWishilistByIdService,
};
