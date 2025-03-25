const Contribution = require("../models/place");
const catchAsync = require("../helpers/catchAsync");

// Create Contribution
const createContribution = catchAsync(async (req, res) => {
  const { latitude, longitude } = req.body;

  // Check if a contribution with the same latitude & longitude already exists
  const existingContribution = await Contribution.findOne({ latitude, longitude });

  if (existingContribution) {
    return res.status(400).json({
      success: false,
      message: "A contribution at this location already exists.",
    });
  }

  // If no existing contribution, save the new one
  const contribution = new Contribution(req.body);
  await contribution.save();

  res.status(201).json({
    success: true,
    message: "Contribution created successfully.",
    data: contribution,
  });
});


// Get All Contributions
const getContributions = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10; 
  const offset = parseInt(req.query.offset, 10) || 0; 
  const status = req.query.status;

  const filter = {};
  if (status) {
    const validStatuses = ['requested', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status value. Allowed values are: ${validStatuses.join(', ')}.` });
    }
    filter.status = status;
  }

  const totalContributions = await Contribution.countDocuments(filter);
  
  const totalPages = Math.ceil(totalContributions / limit);
  console.log(totalContributions);
  
  const contributions = await Contribution.find(filter)
    .skip(offset)
    .limit(limit);

    console.log(contributions);
    
    
  const currentPage = Math.floor(offset / limit) + 1;

  res.status(200).json({
    contributions,
    currentPage,
    totalPages,
    totalContributions,
  });
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


module.exports = {
  createContribution,
  getContributions,
  getContributionById,
  updateContribution,
  deleteContribution,
};
