const Contribution = require("@models/contribution");
const User = require("@models/user");

const contributionRepository = {
  async addContribution(data) {
    const user = await User.findById(data.userId);
    if (!user) {
      return "NOTFOUND";
    }
    return await Contribution.create(data);
  },

  async getContributionByUserId(skip, limit, userId) {
    const contribution = await Contribution.find({ userId })
      .skip(skip)
      .limit(limit);
    if (!contribution) {
      return "NOTFOUND";
    }
    return contribution;
  },

  async calculatePagination(page, limit, userId) {
    const totalContributions = await Contribution.countDocuments({ userId });
    const totalPages = Math.ceil(totalContributions / limit);
    const skip = (page - 1) * limit;
    return { totalContributions, totalPages, skip };
  },
};

module.exports = contributionRepository;
