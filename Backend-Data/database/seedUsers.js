const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@kfupm.edu.sa",
    password: "123456",
    role: "kfupm_admin",
  },
  {
    name: "Maintenance Team",
    email: "maintenance@kfupm.edu.sa",
    password: "123456",
    role: "maintenance_team",
  },
  {
    name: "Regular User",
    email: "user@kfupm.edu.sa",
    password: "123456",
    role: "regular_user",
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL);

    await User.deleteMany({});
    await User.insertMany(users);

    console.log("Users seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();