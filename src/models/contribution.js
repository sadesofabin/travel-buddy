const mongoose = require("mongoose");

const ContributionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    type: {
      type: String,
      enum: ["coastal", "mountain", "desert", "forest", "plain", "hills"],
      required: true,
    },
    description: { type: String, required: true },
    photos: [
      {
        url: { type: String },
        altText: { type: String },
      },
    ],
    bestTime: { type: String },
    facilities: { type: [String] },
    hours: { type: String },
    cost: { type: Number },
    safety: { type: String },
    guides: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5 },
    tips: { type: [String] ,  required: true},
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
