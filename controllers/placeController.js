const Contribution = require("../models/place");
const catchAsync = require("../helpers/catchAsync");

// Create Contribution
const createContribution = catchAsync(async (req, res) => {
  const contribution = new Contribution(req.body);
  await contribution.save();
  res.status(201).json(contribution);
});

// Get All Contributions
const getContributions = catchAsync(async (req, res) => {
  const contributions = await Contribution.find();
  res.status(200).json(contributions);
});

// Get Contribution by ID
const getContributionById = catchAsync(async (req, res) => {
  const contribution = await Contribution.findById(req.params.id);
  if (!contribution)
    return res.status(404).json({ error: "Contribution not found" });
  res.status(200).json(contribution);
});

// Update Contribution
const updateContribution = catchAsync(async (req, res) => {
  const contribution = await Contribution.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!contribution)
    return res.status(404).json({ error: "Contribution not found" });
  res.status(200).json(contribution);
});

// Delete Contribution
const deleteContribution = catchAsync(async (req, res) => {
  const contribution = await Contribution.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  if (!contribution) {
    return res.status(404).json({ error: "Contribution not found" });
  }

  res.status(200).json({ message: "Contribution soft deleted successfully" });
});

const getContributionswithPagenation = catchAsync(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;

  page = Math.max(parseInt(page) || 1, 1);
  limit = Math.max(parseInt(limit) || 10, 1);
  const skip = (page - 1) * limit;

  const contributions = await Contribution.aggregate([
    {
      $match: {
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      },
    },
    {
      $facet: {
        metadata: [{ $count: "totalContributions" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
    { $unwind: { path: "$metadata", preserveNullAndEmptyArrays: true } },
  ]);

  console.log("Aggregation Result:", JSON.stringify(contributions, null, 2));

  const totalContributions =
    contributions.length && contributions[0].metadata
      ? contributions[0].metadata.totalContributions
      : 0;
  const totalPages =
    totalContributions > 0 ? Math.ceil(totalContributions / limit) : 1;

  res.status(200).json({
    page,
    limit,
    totalPages,
    totalContributions,
    data: contributions.length ? contributions[0].data : [],
  });
});

module.exports = {
  createContribution,
  getContributions,
  getContributionById,
  updateContribution,
  deleteContribution,
  getContributionswithPagenation,
};
