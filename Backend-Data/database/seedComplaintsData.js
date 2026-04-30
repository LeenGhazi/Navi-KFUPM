const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Complaint = require("../models/Complaint");

dotenv.config();

const complaints = [
  {
    id: "comp1",
    userId: "2",
    userName: "Ahmed Al-Otaibi",
    locationId: "loc1",
    locationName: "Building 22 (Computer Science)",
    category: "Facility Issue",
    description: "Air conditioning not working in Computer Lab 2",
    status: "in_progress",
    assignedTo: "3",
    notes: "Technician dispatched",
    createdAt: new Date("2024-01-28T10:00:00Z"),
    updatedAt: new Date("2024-01-28T14:00:00Z"),
  }
];

const seedComplaints = async () => {
  try {
    await connectDB();

    await Complaint.deleteMany();
    await Complaint.insertMany(complaints);

    console.log("Complaints seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedComplaints();