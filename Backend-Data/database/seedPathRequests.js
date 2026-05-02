const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PathRequest = require("../models/PathRequest");

dotenv.config();

const pathRequests = [
  {
    userId: "user001",
    creatorName: "Ahmed Al-Salem",
    pathName: "Library to Building 22",
    description: "A shortcut path between the library and building 22",
    pathCoordinates: [
      { x: 100, y: 200 },
      { x: 150, y: 250 },
      { x: 200, y: 300 },
    ],
    startLocation: "Main Library",
    endLocation: "Building 22",
    reason: "This path saves 10 minutes of walking",
    status: "pending",
    rating: 4.8,
    ratingCount: 24,
    reviewedByAdminId: "",
    rejectionReason: "",
  },
  {
    userId: "user002",
    creatorName: "Sara Al-Ghamdi",
    pathName: "Dorm to Cafeteria",
    description: "Direct path from female dorm to main cafeteria",
    pathCoordinates: [
      { x: 300, y: 100 },
      { x: 350, y: 150 },
      { x: 400, y: 200 },
    ],
    startLocation: "Female Dormitory",
    endLocation: "Main Cafeteria",
    reason: "Many students use this route daily",
    status: "approved",
    rating: 4.5,
    ratingCount: 18,
    reviewedByAdminId: "admin001",
    rejectionReason: "",
  },
  {
    userId: "user003",
    creatorName: "Mohammed Al-Otaibi",
    pathName: "Parking to Gym",
    description: "Path from main parking to the gym",
    pathCoordinates: [
      { x: 500, y: 400 },
      { x: 520, y: 450 },
      { x: 540, y: 500 },
    ],
    startLocation: "Main Parking",
    endLocation: "Gym",
    reason: "No clear path exists currently",
    status: "rejected",
    rating: 4.7,
    ratingCount: 15,
    reviewedByAdminId: "admin002",
    rejectionReason: "Path goes through restricted area",
  },
];

const seedPathRequests = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await PathRequest.deleteMany();
    console.log("Old path requests deleted");

    await PathRequest.insertMany(pathRequests);
    console.log("Path requests seeded successfully!");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding path requests:", error);
    mongoose.connection.close();
  }
};

seedPathRequests();