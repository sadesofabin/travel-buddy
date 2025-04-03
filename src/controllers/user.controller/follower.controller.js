const catchAsync = require("../../helpers/catchAsync");
const {
  toggleFollowService,
  getFollowersOrFollowingService,
} = require("../../services/user.services/follower.services");

const toggleFollow = catchAsync(async (req, res) => {
  const data = { userId: req.params.userId, followerId: req.body.followerId };
  if (data.userId === data.followerId) {
    const error = new Error("User cannot follow themselves.");
    error.statusCode = 400;
    throw error;
  }

  const responce = await toggleFollowService(data);
  res
    .status(200)
    .json({ sucess: true, status: 200, message: responce.message });
});

const getFollowersOrFollowing = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const { type, page = 1, limit = 10 } = req.query; // Default pagination values
  
    const response = await getFollowersOrFollowingService({ userId, type, page, limit });
  
    res.status(200).json({
      success: true,
      status: 200,
      totalRecords: response.totalRecords,
      totalPages: response.totalPages,
      currentPage: response.currentPage,
      data: response.data, // Changed `response.response` to `data` for clarity
    });
  });

module.exports = { toggleFollow, getFollowersOrFollowing };
