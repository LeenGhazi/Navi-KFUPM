const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    id: String,
    userId: String,
    userName: String,
    userEmail: String,
    locationId: String,
    locationName: String,
    category: String,
    type: String,
    title: String,
    description: String,
    status: String,
    assignedTo: String,
    notes: String,
    adminResponse: String,
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);