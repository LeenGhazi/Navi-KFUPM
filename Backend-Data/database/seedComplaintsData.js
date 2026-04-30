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
  },
   
  {
    id: "1",
    userId: "user1",
    userName: "Ahmed Ali",
    userEmail: "s202012345@kfupm.edu.sa",
    type: "Technical Issue",
    title: "Map not loading on mobile",
    description: "The campus map fails to load on my iPhone.",
    status: "Submitted",
    createdAt: new Date("2024-03-01T10:30:00"),
  },
  {
    id: "2",
    userId: "user2",
    userName: "Mohammed Salem",
    userEmail: "s202098765@kfupm.edu.sa",
    type: "Service Feedback",
    title: "Incorrect building hours",
    description: "The library hours shown are outdated.",
    status: "In Progress",
    adminResponse: "We are verifying the new hours.",
    createdAt: new Date("2024-02-28T14:20:00"),
  },
  {
    id: "3",
    userId: "user3",
    userName: "Sara Hassan",
    userEmail: "s202011111@kfupm.edu.sa",
    type: "Feature Request",
    title: "Add parking availability status",
    description: "It would be helpful to see parking availability.",
    status: "Resolved",
    adminResponse: "Forwarded to technical team.",
    createdAt: new Date("2024-02-25T09:15:00"),
  },
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