const catchAsync = require("../../helpers/catchAsync");
const {
  addToWishlistService,
  wishlistedService,
} = require("../../services/user.services/wishlist.service");

const addToWishlist = catchAsync(async (req, res) => {
  const responce = await addToWishlistService(req.body);
  res.status(200).json({
    sucess: true,
    status: 200,
    message: `Location ${responce.message} wishlist successfully`,
  });
});

const wishlisted = catchAsync(async (req, res) => {
  const responce = await wishlistedService(
    req.params.userId,
    req.params.locationId
  );
  res.status(200).json({
    sucess: true,
    status: 200,
    isWishlisted: responce,
    message: `Data featched successfully`,
  });
});

module.exports = { addToWishlist, wishlisted };
