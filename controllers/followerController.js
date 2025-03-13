const catchAsync = require("../helpers/catchAsync");
const Follower = require("../models/follower");
const mongoose = require("mongoose");

const toggleFollow = catchAsync(async (req, res) => {
  const { followerId } = req.body;
  const { userId } = req.params;

  // Validate ObjectIds
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

  // Get the user follow document
  let userFollowerDoc = await Follower.findOne({ userId });
  let followerExists = userFollowerDoc?.followers.find((f) => f.user.equals(followerId));

  if (followerExists) {
    // If exists, toggle the follow status
    await Follower.updateOne(
      { userId, "followers.user": followerId },
      { $set: { "followers.$.status": !followerExists.status } }
    );

    await Follower.updateOne(
      { userId: followerId, "following.user": userId },
      { $set: { "following.$.status": !followerExists.status } }
    );
  } else {
    // If not exists, add the new follower **without removing others**
    await Follower.findOneAndUpdate(
      { userId },
      { $addToSet: { followers: { user: followerId, status: true } } },  // ✅ Keeps existing followers
      { upsert: true, new: true }
    );

    await Follower.findOneAndUpdate(
      { userId: followerId },
      { $addToSet: { following: { user: userId, status: true } } },  // ✅ Keeps existing followings
      { upsert: true, new: true }
    );
  }

  return res.status(200).json({
    success: true,
    message: followerExists ? "Follow status toggled successfully." : "User followed successfully.",
  });
});

module.exports = { toggleFollow };
