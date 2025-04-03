const {
  toggleFollow,
  calculatePagination,
  getFollowersOrFollowing,
} = require("../../repository/user.repository/follower.repository");

const toggleFollowService = async (data) => {
  return await toggleFollow(data);
};

const getFollowersOrFollowingService = async ({
  userId,
  type,
  page,
  limit,
}) => {
  if (!["followers", "following"].includes(type)) {
    throw new Error("Invalid type. Must be 'followers' or 'following'.");
  }

  const query = { userId, [`${type}.status`]: true, type };

  const { totalRecords, totalPages, skip } = await calculatePagination(
    page,
    limit,
    query
  );
  if (totalPages < page || totalRecords === 0) {
    const error = new Error(`No ${type} found.`);
    error.statusCode = 404;
    throw error;
  }

  const data = await getFollowersOrFollowing(query, skip, limit);

  return { totalRecords, totalPages, currentPage: page, data };
};
module.exports = {
  toggleFollowService,
  getFollowersOrFollowingService,
};
