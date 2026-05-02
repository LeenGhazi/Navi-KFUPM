const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Feedback = require("../models/Feedback");

dotenv.config();

const feedbackData = [
  {
    userId: "user001",
    userName: "Ahmed",
    userEmail: "ahmed@kfupm.edu.sa",
    message: "App is very useful!",
    category: "general",
    status: "pending",
  },
  {
    userId: "user002",
    userName: "Sara",
    userEmail: "sara@kfupm.edu.sa",
    message: "Map zoom is buggy",
    category: "bug",
    status: "pending",
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Feedback.deleteMany();
  await Feedback.insertMany(feedbackData);

  console.log("Feedback seeded");
  process.exit();
};

seed();