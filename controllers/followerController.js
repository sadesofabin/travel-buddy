const catchAsync = require("../helpers/catchAsync");
const Follower = require("../models/follower");
const mongoose = require("mongoose");
const User = require("../models/user");

const toggleFollow = catchAsync(async (req, res) => {
  const { followerId } = req.body;
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(followerId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID(s).",
    });
  }

  if (userId === followerId) {
    return res.status(400).json({
      success: false,
      message: "User cannot follow themselves.",
    });
  }

  let userFollowerDoc = await Follower.findOne({ userId });
  let followerExists = userFollowerDoc?.followers.find((f) => f.user.equals(followerId));

  if (followerExists) {
    await Follower.updateOne(
      { userId, "followers.user": followerId },
      { $set: { "followers.$.status": !followerExists.status } }
    );

    await Follower.updateOne(
      { userId: followerId, "following.user": userId },
      { $set: { "following.$.status": !followerExists.status } }
    );
  } else {
    await Follower.findOneAndUpdate(
      { userId },
      { $addToSet: { followers: { user: followerId, status: true } } }, 
      { upsert: true, new: true }
    );

    await Follower.findOneAndUpdate(
      { userId: followerId },
      { $addToSet: { following: { user: userId, status: true } } }, 
      { upsert: true, new: true }
    );
  }

  return res.status(200).json({
    success: true,
    message: followerExists ? "Follow status toggled successfully." : "User followed successfully.",
  });
});


// const getFollowersOrFollowing = catchAsync(async (req, res) => {
//   const { userId } = req.params;
//   const { type } = req.query;

//   if (!["followers", "following"].includes(type)) {
//     return res.status(400).json({ success: false, message: "Invalid type. Use 'followers' or 'following'." });
//   }

//   const userData = await Follower.findOne({ userId }).populate({
//     path: `${type}.user`,
//     select: "fullName username email profilePic profileBanner bio phone city profession hobbies dob gender",
//   });

//   if (!userData) {
//     return res.status(404).json({ success: false, message: `No ${type} found.` });
//   }

//   const result = userData[type].map((entry) => ({
//     _id: entry.user._id,
//     fullName: entry.user.fullName,
//     username: entry.user.username,
//     profilePic: entry.user.profilePic,
//     profileBanner: entry.user.profileBanner,
//   }));

//   res.status(200).json({
//     success: true,
//     total: result.length,
//     type,
//     data: result,
//   });
// });


const getFollowersOrFollowing = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { type, limit, offset } = req.query;

  // Validate type
  if (!["followers", "following"].includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid type. Use 'followers' or 'following'.",
    });
  }

  // Convert pagination values to numbers
  const pageLimit = parseInt(limit, 10) || 10;
  const pageOffset = parseInt(offset, 10) || 0;

  // Fetch user followers/following with status=true
  const userData = await Follower.findOne({ userId }).populate({
    path: `${type}.user`,
    select: "fullName username profilePic",
  });

  if (!userData || !userData[type].length) {
    return res.status(404).json({
      success: false,
      message: `No ${type} found.`,
    });
  }

  // Filter only users where status = true
  const filteredData = userData[type].filter(entry => entry.status === true);
  const total = filteredData.length;

  // Apply pagination
  const paginatedData = filteredData
    .slice(pageOffset, pageOffset + pageLimit)
    .map((entry) => ({
      _id: entry.user._id,
      fullName: entry.user.fullName,
      username: entry.user.username,
      profilePic: entry.user.profilePic,
    }));

  // Pagination calculations
  const totalPages = Math.ceil(total / pageLimit);
  const currentPage = Math.floor(pageOffset / pageLimit) + 1;

  res.status(200).json({
    success: true,
    type,
    total,
    totalPages,
    currentPage,
    pageLimit,
    data: paginatedData,
  });
});





module.exports = { toggleFollow , getFollowersOrFollowing};
