const mongoose = require("mongoose");

const LocationRouteSchema = new mongoose.Schema(
  {
    currentlat: { type: Number, required: true },
    currentlng: { type: Number, required: true },
    destinationlat: { type: Number, required: true },
    destinationlng: { type: Number, required: true },
    distance: { type: String, required: true },
    duration: { type: String, required: true },
    expectedArrivalTime: { type: Date, required: true },
  },
  { timestamps: true }
);

const Route = mongoose.model("LocationRoute", LocationRouteSchema);
module.exports = Route;
