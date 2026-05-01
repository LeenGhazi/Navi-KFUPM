const mongoose = require("mongoose");

const buildingReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    locationId: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    hidden: {
      type: Boolean,
      default: false,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BuildingReview", buildingReviewSchema);