const mongoose = require("mongoose");

const ContributionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    type: {
      type: String,
      enum: ["coastal", "mountain", "desert", "forest", "plains", "hills"],
      required: true,
    },
    description: { type: String, required: true },
    photos: [{ type: String }], // Changed from object to array
    bestTime: { type: String },
    facilities: { type: [String] },
    hours: { type: String },
    cost: { type: Number },
    safety: { type: String },
    guides: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5 },
    tips: { type: [String] },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected"],
      default: "requested",
    },
    isDeleted: { type: Boolean, default: false },
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Contribution", ContributionSchema);
