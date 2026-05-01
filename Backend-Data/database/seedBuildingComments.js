const mongoose = require("mongoose");
const dotenv = require("dotenv");
const BuildingComment = require("../models/BuildingComment");

dotenv.config();

const buildingComments = [
  {
    userId: "2",
    userName: "Ahmed Al-Otaibi",
    locationId: "loc1",
    title: "Late night coding session",
    text: "Spent all night here working on my senior project. The Computer Lab 2 is amazing! Met my best friends here during our first semester.",
    likes: ["1", "3"],
  },
  {
    userId: "1",
    userName: "Sara Al-Ahmed",
    locationId: "loc1",
    title: "First day memories",
    text: "I still remember my first day in this building. I was so nervous but the seniors were very helpful. This place holds a special place in my heart.",
    likes: ["2"],
  },
  {
    userId: "2",
    userName: "Ahmed Al-Otaibi",
    locationId: "loc4",
    title: "My favorite study spot",
    text: "The 3rd floor study room is my go-to place before exams. Quiet, peaceful, and great atmosphere for deep focus. Highly recommend!",
    likes: ["1", "3"],
  },
  {
    userId: "3",
    userName: "Khaled Al-Rashid",
    locationId: "loc5",
    title: "Best shawarma on campus",
    text: "The shawarma here is legendary! Every Friday after class, we come here with friends. Good food, good vibes.",
    likes: ["2"],
  },
  {
    userId: "1",
    userName: "Sara Al-Ahmed",
    locationId: "loc8",
    title: "Home away from home",
    text: "Living here for 3 years now. Made lifelong friends and countless memories. The study lounge on the 2nd floor is where we pull all-nighters together!",
    likes: ["2", "3"],
  },
];

async function seedBuildingComments() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await BuildingComment.deleteMany();
    await BuildingComment.insertMany(buildingComments);

    console.log("Building comments seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding building comments:", error);
    process.exit(1);
  }
}

seedBuildingComments();