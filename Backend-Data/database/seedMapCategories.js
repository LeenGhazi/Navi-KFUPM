const mongoose = require("mongoose");
const dotenv = require("dotenv");
const MapCategory = require("../models/MapCategory");

dotenv.config();

const categories = [
  { categoryName: "academic", displayLabel: "Academic Buildings", icon: "🎓", color: "#4A90D9", order: 1, active: true },
  { categoryName: "cafe", displayLabel: "Cafes", icon: "☕", color: "#8B4513", order: 2, active: true },
  { categoryName: "restaurant", displayLabel: "Restaurants", icon: "🍽️", color: "#FF6B35", order: 3, active: true },
  { categoryName: "dorm", displayLabel: "Dormitories", icon: "🏠", color: "#6B8E23", order: 4, active: true },
  { categoryName: "parking", displayLabel: "Parking", icon: "🅿️", color: "#708090", order: 5, active: true },
  { categoryName: "library", displayLabel: "Library", icon: "📚", color: "#8B0000", order: 6, active: true },
  { categoryName: "sports", displayLabel: "Sports Facilities", icon: "⚽", color: "#228B22", order: 7, active: true },
  { categoryName: "restroom", displayLabel: "Restrooms", icon: "🚻", color: "#4682B4", order: 8, active: true },
  { categoryName: "prayer", displayLabel: "Prayer Rooms", icon: "🕌", color: "#DAA520", order: 9, active: true },
];

const seedMapCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await MapCategory.deleteMany();
    console.log("Old categories deleted");

    await MapCategory.insertMany(categories);
    console.log("Map categories seeded successfully!");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding map categories:", error);
    mongoose.connection.close();
  }
};

seedMapCategories();