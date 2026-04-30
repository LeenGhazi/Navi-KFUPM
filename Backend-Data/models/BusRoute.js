const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
});

const busRouteSchema = new mongoose.Schema(
  {
    routeId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["female", "male"],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    operatingHours: {
      type: String,
      required: true,
    },
    stops: [stopSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusRoute", busRouteSchema);