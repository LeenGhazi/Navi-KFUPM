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
    description:
      "Computer Science and Engineering Department. Home to cutting-edge research labs and modern classrooms.",
    openHours: "7:00 AM - 9:00 PM",
    amenities: ["Computer Labs", "Study Areas", "Faculty Offices", "Auditorium"],
    services: [
      { name: "IT Support Desk", hours: "8:00 AM - 4:00 PM" },
      { name: "Student Advising", hours: "9:00 AM - 3:00 PM" },
      { name: "Printing Services", hours: "7:30 AM - 8:00 PM" },
    ],
    facilities: {
      labs: ["Computer Lab 1", "Computer Lab 2", "AI Research Lab", "Networking Lab"],
      printers: 12,
      prayerRooms: 2,
      bathrooms: 8,
      studyRooms: 6,
    },
  },
  {
    id: "loc2",
    name: "Building 5 (Mathematics)",
    category: "academic",
    coordinates: { x: 535, y: 460 },
    buildingShape: { width: 70, height: 55 },
    description: "Mathematics Department with lecture halls and tutorial rooms.",
    openHours: "7:00 AM - 8:00 PM",
    amenities: ["Lecture Halls", "Tutorial Rooms", "Faculty Offices"],
    facilities: {
      labs: ["Mathematics Lab"],
      printers: 6,
      prayerRooms: 1,
      bathrooms: 6,
      studyRooms: 4,
    },
  },
  {
    id: "loc3",
    name: "Building 9 (Petroleum Engineering)",
    category: "academic",
    coordinates: { x: 900, y: 700 },
    buildingShape: { width: 90, height: 70 },
    description:
      "Petroleum Engineering Department with specialized labs and research facilities.",
    openHours: "7:00 AM - 9:00 PM",
    amenities: ["Research Labs", "Simulation Centers", "Faculty Offices"],
    facilities: {
      labs: ["Petroleum Lab", "Drilling Simulation Lab", "Research Lab 1", "Research Lab 2"],
      printers: 8,
      prayerRooms: 2,
      bathrooms: 10,
      studyRooms: 5,
    },
  },
  {
    id: "loc4",
    name: "King Fahd Central Library",
    category: "library",
    coordinates: { x: 610, y: 560 },
    buildingShape: { width: 120, height: 80 },
    description: "Main university library with extensive collection and study spaces.",
    openHours: "8:00 AM - 12:00 AM",
    capacity: 2000,
    amenities: ["Reading Rooms", "Computer Labs", "Group Study Rooms", "Silent Study Areas"],
    facilities: {
      labs: ["Computer Lab"],
      printers: 20,
      prayerRooms: 3,
      bathrooms: 12,
      studyRooms: 15,
    },
  },
  {
    id: "loc5",
    name: "Student Center Cafeteria",
    category: "restaurant",
    coordinates: { x: 250, y: 450 },
    buildingShape: { width: 85, height: 50 },
    description: "Main cafeteria offering variety of meals and dining options.",
    openHours: "6:00 AM - 11:00 PM",
    amenities: ["Indoor Seating", "Outdoor Terrace", "Multiple Cuisines"],
    facilities: {
      printers: 2,
      prayerRooms: 1,
      bathrooms: 6,
    },
  },
  {
    id: "loc6",
    name: "Starbucks",
    category: "cafe",
    coordinates: { x: 150, y: 350 },
    buildingShape: { width: 40, height: 35 },
    description: "Coffee shop with beverages and light snacks.",
    openHours: "7:00 AM - 10:00 PM",
    facilities: {
      bathrooms: 2,
    },
  },
  {
    id: "loc7",
    name: "Dhahran Cafe",
    category: "cafe",
    coordinates: { x: 650, y: 500 },
    buildingShape: { width: 45, height: 35 },
    description: "Campus cafe offering coffee, tea, and pastries.",
    openHours: "7:00 AM - 9:00 PM",
    facilities: {
      bathrooms: 2,
    },
  },
  {
    id: "loc8",
    name: "Dorm 1",
    category: "dorm",
    coordinates: { x: 850, y: 880 },
    buildingShape: { width: 100, height: 90 },
    description: "Undergraduate student dormitory with modern facilities.",
    capacity: 500,
    amenities: ["Common Rooms", "Study Lounges", "Prayer Room", "Laundry"],
    facilities: {
      printers: 4,
      prayerRooms: 2,
      bathrooms: 30,
      studyRooms: 8,
    },
  },
  {
    id: "loc9",
    name: "Dorm 5",
    category: "dorm",
    coordinates: { x: 520, y: 210 },
    buildingShape: { width: 100, height: 90 },
    description: "Graduate student dormitory.",
    capacity: 400,
    amenities: ["Study Lounges", "Prayer Room", "Laundry", "Gym"],
    facilities: {
      printers: 3,
      prayerRooms: 2,
      bathrooms: 25,
      studyRooms: 6,
    },
  },
  {
    id: "loc10",
    name: "Parking Lot A",
    category: "parking",
    coordinates: { x: 150, y: 250 },
    buildingShape: { width: 80, height: 40 },
    description: "Main parking facility near academic buildings.",
    capacity: 300,
  },
  {
    id: "loc11",
    name: "Parking Lot B",
    category: "parking",
    coordinates: { x: 700, y: 400 },
    buildingShape: { width: 70, height: 40 },
    description: "Parking near dormitories.",
    capacity: 200,
  },
  {
    id: "loc12",
    name: "Sports Complex",
    category: "sports",
    coordinates: { x: 800, y: 500 },
    buildingShape: { width: 110, height: 75 },
    description: "Multi-purpose sports facility with gym and courts.",
    openHours: "6:00 AM - 11:00 PM",
    amenities: ["Gym", "Basketball Courts", "Swimming Pool", "Tennis Courts"],
    facilities: {
      prayerRooms: 2,
      bathrooms: 8,
    },
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