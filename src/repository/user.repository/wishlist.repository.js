const User = require("../../models/user");
const { Location } = require("../../models/locationdata");
const Wishlist = require("../../models/wishList");

const wishListRepository = {
  async addToWishlist(data) {
    const { userId, locationId } = data;
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return "USERNOTFOUND";
    }
    const locationExists = await Location.exists({ _id: locationId });
    if (!locationExists) {
      return "LOCATIONNOTFOUND";
    }
    const wishlistItem = await Wishlist.findOneAndUpdate(
      { userId, locationId },
      [
        {
          $set: {
            wishList: { $not: "$wishList" },
            userId: "$userId",
            locationId: "$locationId",
          },
        },
      ],
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    const currentStatus = wishlistItem.wishList ? "added to" : "removed from";

    return { message: currentStatus };
  },
};

module.exports = wishListRepository;
