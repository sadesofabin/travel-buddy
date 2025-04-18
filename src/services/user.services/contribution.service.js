const axios = require("axios");
const {
  addContribution,
  getContributionByUserId,
  calculatePagination,
} = require("@repository/user.repository/contribution.repository");

const addContributionService = async (data) => {
  const { latitude, longitude, photos } = data;

  const nominatimURL = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  const geoRes = await axios.get(nominatimURL, {
    headers: {
      "User-Agent": "TravelBuddy/1.0 (abin.m.n007@gmail.com)",
    },
  });

  const location = geoRes.data.address;
  const country = location.country || null;
  const state = location.state || null;
  const district =
    location.state_district ||
    location.county ||
    location.city_district ||
    location.city ||
    null;
  const terrainRes = await axios.get(
    `https://api.open-meteo.com/v1/elevation?latitude=${latitude}&longitude=${longitude}`
  );

  const elevation = terrainRes.data.elevation || null;
  const terrainType = getTerrainType(elevation, data.terrainKeywords);
  data.country = country;
  data.state = state;
  data.district = district;
  data.type = terrainType;

  if (Array.isArray(photos)) {
    data.photos = photos.map((url) => ({
      url: url,
      altText: data.name || "photo",
    }));
  }
  delete terrainKeywords;
  const response = await addContribution(data);

  if (response === "NOTFOUND") {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return "success";
};

const getTerrainType = (elevation, terrainKeywords) => {
  const elevationNum = parseFloat(elevation);
  const lowerLocation = JSON.stringify(terrainKeywords).toLowerCase();

  if (elevationNum >= 2500) return "mountain";
  if (
    elevationNum <= 50 &&
    (lowerLocation.includes("coast") ||
      lowerLocation.includes("beach") ||
      lowerLocation.includes("shore"))
  ) {
    return "coastal";
  }
  if (lowerLocation.includes("desert")) return "desert";
  if (lowerLocation.includes("forest") || lowerLocation.includes("jungle"))
    return "forest";
  if (elevationNum <= 200) return "plain";

  return "unknown";
};

const getContributionService = async (page, limit, userId) => {
  const { totalContributions, totalPages, skip } = await calculatePagination(
    page,
    limit,
    userId
  );

  const response = await getContributionByUserId(skip, limit, userId);
  if (response === "NOTFOUND") {
    const error = new Error("Contribution not found");
    error.statusCode = 404;
    throw error;
  }
  return { totalContributions, totalPages, skip, response };
};

module.exports = {
  addContributionService,
  getContributionService,
};
