const mongoose = require("mongoose");
const dotenv = require("dotenv");
const BuildingReview = require("../models/BuildingReview");

dotenv.config();

const reviews = [
  {
    userId: "2",
    userName: "Ahmed Al-Otaibi",
    locationId: "loc1",
    text: "Great facilities and very well maintained. The computer labs are top-notch!",
    rating: 5,
  },
  {
    userId: "1",
    userName: "Sara Al-Ahmed",
    locationId: "loc1",
    text: "Nice place to study but sometimes crowded during exams.",
    rating: 4,
  },
];

async function seedReviews() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await BuildingReview.deleteMany();
    await BuildingReview.insertMany(reviews);

    console.log("Reviews seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding reviews:", error);
    process.exit(1);
  }
}

seedReviews();