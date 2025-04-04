const {
  addToWishlist,
} = require("../../repository/user.repository/wishlist.repository");

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

module.exports = {
  addToWishlistService,
};
