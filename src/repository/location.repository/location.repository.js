const { Location, Hotel } = require("../../models/locationdata");
const locationroute = require("../../models/locationroute");
const axios = require("axios");

const locationRepository = {
  async getAllLocations(skip, limit, query) {
    return await Location.find(query).skip(skip).limit(limit);
  },

  async getRouteFromDB(currentLocation, destination) {
    return await locationroute.findOne({
      currentlat: currentLocation[1],
      currentlng: currentLocation[0],
      destinationlat: destination[1],
      destinationlng: destination[0],
    });
  },

  async saveRouteToDB(currentLocation, destination, routeData) {
    const newRoute = new locationroute({
      currentlat: currentLocation[1],
      currentlng: currentLocation[0],
      destinationlat: destination[1],
      destinationlng: destination[0],
      distance: routeData.distance,
      duration: routeData.duration,
      expectedArrivalTime: routeData.expectedArrivalTime,
    });

    await newRoute.save();
  },
  async fetchRouteFromAPI(currentLocation, destination, orsApiKey) {
    const url = "https://api.openrouteservice.org/v2/directions/driving-car";
    const requestData = {
      coordinates: [currentLocation, destination],
      format: "json",
    };

    try {
      const { data } = await axios.post(url, requestData, {
        headers: {
          Authorization: orsApiKey,
          "Content-Type": "application/json",
        },
      });

      if (data.routes.length > 0) {
        const route = data.routes[0].segments[0];
        const durationInSeconds = route.duration;
        const distanceInMeters = route.distance;

        const distanceText = (distanceInMeters / 1000).toFixed(2) + " km";
        const durationText = (durationInSeconds / 60).toFixed(2) + " min";
        const arrivalTime = new Date(
          Date.now() + durationInSeconds * 1000
        ).toISOString();

        return {
          distance: distanceText,
          duration: durationText,
          expectedArrivalTime: arrivalTime,
        };
      }
      return { error: "No route found" };
    } catch (error) {
      console.error(
        "Error fetching route data:",
        error.response?.data || error.message
      );
      return { error: "Route data unavailable" };
    }
  },
  async calculatePagination(page, limit, query) {
    const totalLocations = await Location.countDocuments(query);
    const totalPages = Math.ceil(totalLocations / limit);
    const skip = (page - 1) * limit;

    return { totalLocations, totalPages, skip };
  },

  async getLocations(skip, limit, query) {
    const response = await Location.find(query).skip(skip).limit(limit);

    return response;
  },

  async locationPagination(page, limit, query) {
    const totalLocations = await Location.countDocuments(query);
    const totalPages = Math.ceil(totalLocations / limit);
    const skip = (page - 1) * limit;

    return { totalLocations, totalPages, skip };
  },

  async nearByLocations(skip, limit, query) {
    await Location.createIndexes({ location: "2dsphere" });

    const radiusInKm = 30;
    const earthRadiusInKm = 6378.1;
    const radiusInRadians = radiusInKm / earthRadiusInKm;

    const response = await Location.find({
      location: {
        $geoWithin: {
          $centerSphere: [[query.lng, query.lat], radiusInRadians],
        },
      },
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .select(
        "slug state district terrain placeName description location title rating photos"
      );

    if (response.length === 0) {
      throw new Error("No nearby locations found.");
    }
    return response;
  },

  async nearByLocationPagination(page, limit, query) {
    const radiusInKm = 30;
    const earthRadiusInKm = 6378.1;
    const radiusInRadians = radiusInKm / earthRadiusInKm;

    const totalLocations = await Location.countDocuments({
      location: {
        $geoWithin: {
          $centerSphere: [[query.lng, query.lat], radiusInRadians],
        },
      },
      isDeleted: false,
    });

    const totalPages = Math.ceil(totalLocations / limit);
    const skip = (page - 1) * limit;

    return { totalLocations, totalPages, skip };
  },

  async nearByHotels(skip, limit, query) {
    await Hotel.createIndexes({ location: "2dsphere" });

    const radiusInKm = 30;
    const earthRadiusInKm = 6378.1;
    const radiusInRadians = radiusInKm / earthRadiusInKm;

    const response = await Hotel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[query.lng, query.lat], radiusInRadians],
        },
      },
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit);

    if (response.length === 0) {
      throw new Error("No nearby Hotels found.");
    }
    return response;
  },

  async nearByHotelsPagination(page, limit, query) {
    const radiusInKm = 30;
    const earthRadiusInKm = 6378.1;
    const radiusInRadians = radiusInKm / earthRadiusInKm;

    const totalHotels = await Hotel.countDocuments({
      location: {
        $geoWithin: {
          $centerSphere: [[query.lng, query.lat], radiusInRadians],
        },
      },
      isDeleted: false,
    });

    const totalPages = Math.ceil(totalHotels / limit);
    const skip = (page - 1) * limit;

    return { totalHotels, totalPages, skip };
  },
};

module.exports = locationRepository;
