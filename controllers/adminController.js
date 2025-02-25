const Contribution = require('../models/place');
const { Location } = require('../models/locationdata');
const catchAsync = require('../helpers/catchAsync');

// Approve contribution and add to Location
const approveContribution = catchAsync(async (req, res) => {
  const { contributionId } = req.params;

  // Find the contribution by ID
  const contribution = await Contribution.findById(contributionId);
  if (!contribution) {
    return res.status(404).json({ success: false, message: 'Contribution not found' });
  }

  // Check if it's already approved
  if (contribution.status === 'approved') {
    return res.status(400).json({ success: false, message: 'Contribution is already approved' });
  }

  // Update contribution status to approved
  contribution.status = 'approved';
  await contribution.save();

  // Add the approved contribution as a new Location
  const newLocation = new Location({
    slug: contribution.name.toLowerCase().replace(/\s+/g, '-'),
    state: contribution.state, // You can update this based on user input
    district: contribution.district, // Same here
    location: {
      type: 'Point',
      coordinates: [contribution.longitude, contribution.latitude],
    },
    terrain: contribution.type,
    title: contribution.name,
    placeName: contribution.name,
    description: contribution.description,
    rating: contribution.rating || 0,
    photos: contribution.photos,
    resource: 'individual', // Since it's a contribution
    metaTitle: contribution.name,
    metaDescription: contribution.description.slice(0, 150),
  });

  await newLocation.save();

  res.status(200).json({
    success: true,
    message: 'Contribution approved and added to locations successfully',
    location: newLocation,
  });
});

module.exports = { approveContribution };
