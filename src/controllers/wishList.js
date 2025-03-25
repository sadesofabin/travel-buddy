const User = require("../models/user");
const Wishlist = require("../models/wishList");
const catchAsync = require("../helpers/catchAsync");
const { Location } = require("../models/locationdata");

const addToWishlist = catchAsync(async (req, res) => {
  const { userId, locationId } = req.body;

  // Validate required fields
  if (!userId || !locationId) {
    return res.status(400).json({
      success: false,
      message: "userId and locationId are required",
    });
  }

  // Check if the user exists
  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check if the location exists
  const locationExists = await Location.exists({ _id: locationId });
  if (!locationExists) {
    return res
      .status(404)
      .json({ success: false, message: "Location not found" });
  }

  // Attempt to find and update the wishlist item
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

  // Determine the current status of the wishList
  const currentStatus = wishlistItem.wishList ? "added to" : "removed from";

  res.status(200).json({
    success: true,
    message: `Location ${currentStatus} wishlist successfully`,
    wishlistItem,
  });
});

module.exports = { addToWishlist };
