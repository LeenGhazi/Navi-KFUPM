const mongoose = require("mongoose");

const buildingCommentSchema = new mongoose.Schema(
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

    title: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    likes: {
      type: [String], 
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BuildingComment", buildingCommentSchema);