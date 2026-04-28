const mongoose = require("mongoose");

const busRouteSchema = new mongoose.Schema(
  {
    id: String,
    name: { type: String, required: true },

    stops: [
      {
        id: String,
        name: String,
        coordinates: {
          x: Number,
          y: Number,
        },
        arrivalTimes: [String],
      },
    ],

    color: String,

    path: [
      {
        x: Number,
        y: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusRoute", busRouteSchema);