const { Location, Hotel } = require("../../models/locationdata");
const locationroute = require("../../models/locationroute");
const axios = require("axios");

const locationRepository = {
  async getAllLocations(skip, limit, query) {    
    return await Location.find(query).skip(skip).limit(limit);
  },

  async getRouteFromDB(currentLocation, destination) {
    console.log(currentLocation, destination );
    
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
          statusCode: 200,
          distance: distanceText,
          duration: durationText,
          expectedArrivalTime: arrivalTime,
        };
      }
      return { error: "No route found" };
    } catch (error) {
      // Extract detailed ORS message if available
      const orsErrorMessage = error?.response?.data?.error?.message;
      const orsErrorCode = error?.response?.data?.error?.code;
  
      if (orsErrorCode === 2010) {
        return {
          statusCode:2010,
          distance: 0,
          duration: 0,
          expectedArrivalTime: 0,
        };
      }
  
      // Generic fallback error
      console.error("Error fetching route data:", error?.response?.data || error.message);
      return {
        error: orsErrorMessage || "Route data unavailable",
      };
    }
  },
  async calculatePagination(page, limit, query) {
    const totalLocations = await Location.countDocuments(query);
    const totalPages = Math.ceil(totalLocations / limit);
    const skip = (page - 1) * limit;

    return { totalLocations, totalPages, skip };
  },

  async getLocations(skip, limit, query) {
    const locations = await Location.find(query).skip(skip).limit(limit);

    const districts = [...new Set(locations.map((loc) => loc.district))];

    const touristCounts = await Location.aggregate([
      { $match: { district: { $in: districts } } },
      { $group: { _id: "$district", count: { $sum: 1 } } },
    ]);

    const hotelCounts = await Hotel.aggregate([
      { $match: { district: { $in: districts } } },
      { $group: { _id: "$district", count: { $sum: 1 } } },
    ]);

    const toMap = (arr) => {
      return arr.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});
    };

    const touristMap = toMap(touristCounts);
    const hotelMap = toMap(hotelCounts);

    const response = locations.map((loc) => ({
      ...loc.toObject(),
      touristPlaceCount: touristMap[loc.district] || 0,
      hotelCount: hotelMap[loc.district] || 0,
    }));

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
  async getAllLocationsBySlug(slug) {
    return await Location.find({ slug });
  },
};

module.exports = locationRepository;
