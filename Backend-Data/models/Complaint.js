const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    id: String,
    userId: String,
    userName: String,
    locationId: String,
    locationName: String,
    category: String,
    description: String,
    status: String,
    assignedTo: String,
    notes: String,
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);