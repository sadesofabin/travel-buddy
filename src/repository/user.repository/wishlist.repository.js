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
  async wishlisted(userId, locationId) {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return "USERNOTFOUND";
    }
    const locationExists = await Location.exists({ _id: locationId });
    if (!locationExists) {
      return "LOCATIONNOTFOUND";
    }
    const wishlistEntry = await Wishlist.findOne({ userId, locationId, wishList: true });
    return !!wishlistEntry;
  },

  async getWishilistById(skip, limit, userId) {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return "USERNOTFOUND";
    }

    const wishlistEntry = await Wishlist.find({ userId })
      .skip(skip)
      .limit(limit)
      .populate("locationId");

    if (!wishlistEntry) {
      return "NOTFOUND";
    }

    return wishlistEntry;
  },
  async calculatePagination(page, limit, userId) {
    const totalLocations = await Wishlist.countDocuments({ userId });
    const totalPages = Math.ceil(totalLocations / limit);
    const skip = (page - 1) * limit;

    return { totalLocations, totalPages, skip };
  },
};

module.exports = wishListRepository;
