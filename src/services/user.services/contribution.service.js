const {
  addContribution,
  getContributionByUserId,
  calculatePagination,
} = require("@repository/user.repository/contribution.repository");

const addContributionService = async (data) => {
  const response = await addContribution(data);
  if (response === "NOTFOUND") {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return "sucess";
};

const getContributionService = async (page, limit, userId) => {
  const { totalContributions, totalPages, skip } = await calculatePagination(
    page,
    limit,
    userId
  );

  const response = await getContributionByUserId(skip, limit, userId);
  if (response === "NOTFOUND") {
    const error = new Error("Contribution not found");
    error.statusCode = 404;
    throw error;
  }
  return { totalContributions, totalPages, skip, response };
};

module.exports = {
  addContributionService,
  getContributionService,
};
