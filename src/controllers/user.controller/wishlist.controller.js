const catchAsync = require("../../helpers/catchAsync");
const {
  addToWishlistService,
  wishlistedService,
  getWishilistByIdService
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
const getWishilistById = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const responce = await getWishilistByIdService(
    page,
    limit,
    req.params.userId,
    req.query.lat,
    req.query.long
  );
  res.status(200).json({
    sucess: true,
    status: 200,
    wishlist: responce,
    message: `Data featched successfully`,
  });
});

module.exports = { addToWishlist, wishlisted, getWishilistById };
