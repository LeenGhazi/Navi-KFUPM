const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: String,
    userName: String,
    userEmail: String,

    message: String,
    category: {
      type: String,
      enum: ["general", "bug", "suggestion"],
      default: "general",
    },

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);