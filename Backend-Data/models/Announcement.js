const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    id: String,
    title: { type: String, required: true },
    content: String,
    category: String,
    date: Date,
    priority: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);