const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Story = require("../models/Story");

dotenv.config();

const stories = [
  {
    userId: "user001",
    userName: "Ahmed Ali",
    locationId: "building001",
    title: "Best study spot on campus!",
    storyText: "Building 24 has the best quiet study rooms. Highly recommend going early in the morning.",
    likes: 12,
    status: "approved",
  },
  {
    userId: "user002",
    userName: "Sara Mohammed",
    locationId: "building002",
    title: "Great coffee at the cafe",
    storyText: "The cafe near the library has amazing coffee. Perfect place to study between classes.",
    likes: 8,
    status: "approved",
  },
  {
    userId: "user003",
    userName: "Khalid Hassan",
    locationId: "building003",
    title: "Prayer room is very clean",
    storyText: "The prayer room in building 31 is always clean and well maintained.",
    likes: 15,
    status: "pending",
  },
];

const seedStories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Story.deleteMany();
    console.log("Old stories deleted");

    await Story.insertMany(stories);
    console.log("Stories seeded successfully!");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding stories:", error);
    mongoose.connection.close();
  }
};

seedStories();