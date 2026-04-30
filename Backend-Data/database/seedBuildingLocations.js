const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Building = require("../models/Building");

dotenv.config();

const buildings = [
  {
    id: "loc1",
    name: "Building 22 (Computer Science)",
    category: "academic",
    coordinates: { x: 800, y: 700 },
    buildingShape: { width: 80, height: 60 },
    description: "Computer Science and Engineering Department.",
    openHours: "7:00 AM - 9:00 PM",
    amenities: ["Computer Labs", "Study Areas", "Faculty Offices", "Auditorium"],
  },
  {
    id: "loc2",
    name: "Building 5 (Mathematics)",
    category: "academic",
    coordinates: { x: 535, y: 460 },
    buildingShape: { width: 70, height: 55 },
    description: "Mathematics Department",
  },
  {
    id: "loc3",
    name: "Building 9 (Petroleum Engineering)",
    category: "academic",
    coordinates: { x: 900, y: 700 },
    buildingShape: { width: 90, height: 70 },
    description: "Petroleum Engineering Department",
  },
  {
    id: "loc4",
    name: "King Fahd Central Library",
    category: "library",
    coordinates: { x: 610, y: 560 },
    buildingShape: { width: 120, height: 80 },
    description: "Main university library",
  },
  {
    id: "loc5",
    name: "Student Center Cafeteria",
    category: "restaurant",
    coordinates: { x: 250, y: 450 },
    description: "Main cafeteria",
  },
  {
    id: "loc6",
    name: "Starbucks",
    category: "cafe",
    coordinates: { x: 150, y: 350 },
    description: "Coffee shop",
  },
  {
    id: "loc7",
    name: "Dhahran Cafe",
    category: "cafe",
    coordinates: { x: 650, y: 500 },
    description: "Campus cafe",
  },
  {
    id: "loc8",
    name: "Dorm 1",
    category: "dorm",
    coordinates: { x: 850, y: 880 },
    description: "Undergraduate dorm",
  },
  {
    id: "loc9",
    name: "Dorm 5",
    category: "dorm",
    coordinates: { x: 520, y: 210 },
    description: "Graduate dorm",
  },
  {
    id: "loc10",
    name: "Parking Lot A",
    category: "parking",
    coordinates: { x: 150, y: 250 },
  },
  {
    id: "loc11",
    name: "Parking Lot B",
    category: "parking",
    coordinates: { x: 700, y: 400 },
  },
  {
    id: "loc12",
    name: "Sports Complex",
    category: "sports",
    coordinates: { x: 800, y: 500 },
    description: "Sports facility",
  },
];

const seedBuildings = async () => {
  try {
    await connectDB();

    await Building.deleteMany();
    await Building.insertMany(buildings);

    console.log("Buildings seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedBuildings();