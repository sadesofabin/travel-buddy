const Follower = require("../../models/follower");

const followerRepository = {
  async toggleFollow(data) {
    const userId = data.userId;
    const followerId = data.followerId;

    let userFollowerDoc = await Follower.findOne({ userId });

    let followerExists = userFollowerDoc?.followers.find((f) =>
      f.user.equals(followerId)
    );

    if (followerExists) {
      if (followerExists.status === true) {
        await Follower.updateOne(
          { userId, "followers.user": followerId },
          { $set: { "followers.$.status": false } }
        );

        await Follower.updateOne(
          { userId: followerId, "following.user": userId },
          { $set: { "following.$.status": false } }
        );

        return { message: "User unfollowed successfully." };
      } else {
        await Follower.updateOne(
          { userId, "followers.user": followerId },
          { $set: { "followers.$.status": true } }
        );

        await Follower.updateOne(
          { userId: followerId, "following.user": userId },
          { $set: { "following.$.status": true } }
        );

        return { message: "User followed successfully." };
      }
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

      return { message: "User followed successfully." };
    }
  },
  async getFollowersOrFollowing(query, skip, limit) {
    const { userId, type } = query;
    const response = await Follower.findOne({ userId }).populate({
      path: `${type}.user`,
      select: "fullName username profilePic",
      options: { skip, limit },
    });

    return response ? response[type] : [];
  },

  async calculatePagination(page, limit, query) {
    const { userId, type } = query;
    const userDoc = await Follower.findOne({ userId }).select(`${type}`);

    if (!userDoc || !userDoc[type]) {
      return { totalRecords: 0, totalPages: 0, skip: 0 };
    }
    const totalRecords = userDoc[type].filter(
      (entry) => entry.status === true
    ).length;
    const totalPages = Math.ceil(totalRecords / limit);
    const skip = (page - 1) * limit;

    return { totalRecords, totalPages, skip };
  },
};

module.exports = followerRepository;
