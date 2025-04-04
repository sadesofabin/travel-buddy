const catchAsync = require("../../helpers/catchAsync");
const {
  addToWishlistService,
} = require("../../services/user.services/wishlist.service");

const addToWishlist = catchAsync(async (req, res) => {
  const responce = await addToWishlistService(req.body);
  res.status(200).json({
    sucess: true,
    status: 200,
    message: `Location ${responce.message} wishlist successfully`,
  });
});

module.exports = { addToWishlist };
