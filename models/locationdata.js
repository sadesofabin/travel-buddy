const mongoose = require("mongoose");


const LocationSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    terrain: {
      type: String,
      enum: ['mountain', 'forest', 'desert', 'coastal', 'plain'],
      required: true,
    },
    title: { type: String, required: true },
    placeName: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    photos: [{ type: String }],
    resource: {
      type: String,
      enum: ['public', 'individual'],
      required: true,
    },
    metaTitle: { type: String },
    metaDescription: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

LocationSchema.index({ location: "2dsphere" }); 
LocationSchema.index({ state: 1, district: 1, terrain: 1, isDeleted: 1 });


const HotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: { 
      type: String, 
      enum: ["hotel", "resort"], 
      required: true 
    },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    state: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },

    photos: [{ type: String }],

    rooms: [
      {
        roomType: { type: String, required: true },
        pricePerNight: { type: Number, required: true },
        capacity: { type: Number, required: true },
        amenities: [{ type: String }],
        availability: { type: Boolean, default: true },
      },
    ],

    amenities: [{ type: String }],

    contactInfo: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
    },

    metaTitle: { type: String },
    metaDescription: { type: String },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

HotelSchema.index({ location: "2dsphere" });

module.exports = {
  Location: mongoose.model("Location", LocationSchema),
  Hotel: mongoose.model("Hotel", HotelSchema),
};