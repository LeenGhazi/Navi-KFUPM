const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    userId: String,
    userName: String,
    locationId: String,
    title: String,
    storyText: String,
    likes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);