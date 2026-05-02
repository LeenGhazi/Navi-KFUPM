const mongoose = require("mongoose");

const pathRequestSchema = new mongoose.Schema(
  {
    userId: String,
    pathName: String,
    description: String,
    pathCoordinates: Array,
    startLocation: String,
    endLocation: String,
    reason: String,
    creatorName: String,
    rating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedByAdminId: String,
    rejectionReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PathRequest", pathRequestSchema);