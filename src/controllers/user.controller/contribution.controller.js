const catchAsync = require("../../helpers/catchAsync");
const {
  addContributionService,
  getContributionService,
} = require("../../services/user.services/contribution.service");

const addContribution = catchAsync(async (req, res) => {
  await addContributionService(req.body);
  res.status(201).json({
    sucess: true,
    status: 201,
    message: "Contribution created successfully.",
  });
});

const getContribution = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit, 10) || 10; 
  const page = parseInt(req.query.page, 10) || 1; 
  const contribution = await getContributionService(page, limit, userId);
  res.status(200).json({
    sucess: true,
    status: 200,
    totalContributions: contribution.totalContributions,
    totalPages: contribution.totalPages,
    skip: contribution.skip,
    contributions: contribution.response,
  });
});

module.exports = { addContribution, getContribution };
