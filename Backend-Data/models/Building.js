const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema(
  {
    id: String, // keep this because frontend uses loc1, loc2...
    name: { type: String, required: true },
    category: { type: String, required: true },

    coordinates: {
      x: Number,
      y: Number,
    },

    buildingShape: {
      width: Number,
      height: Number,
    },

    description: String,
    openHours: String,
    capacity: Number,
    amenities: [String],

    services: [
      {
        name: String,
        hours: String,
      },
    ],

    facilities: {
      labs: [String],
      printers: Number,
      prayerRooms: Number,
      bathrooms: Number,
      studyRooms: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Building", buildingSchema);