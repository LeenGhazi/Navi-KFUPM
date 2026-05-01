const mongoose = require("mongoose");
const dotenv = require("dotenv");
const TechRequest = require("../models/TechRequest");

dotenv.config();

const techRequests = [
  {
    requestType: "Hide/Delete a Comment/Rating",
    title: "comment is not correct",
    description: "please delete comment",
    status: "Pending",
    submittedBy: "Admin User",
  },
  {
    requestType: "Building Service Update",
    title: "Update Library Operating Hours",
    description: "Please update the library hours to 24/7 during exam week",
    status: "In Progress",
    submittedBy: "Admin User",
    techResponse:
      "Technical team is reviewing the request. Expected completion by March 5th.",
  },
  {
    requestType: "Announcement Add",
    title: "Add Spring Registration Announcement",
    description: "New announcement for spring semester registration dates",
    status: "Completed",
    submittedBy: "Admin User",
    techResponse: "Announcement has been added to the system successfully.",
  },
];

async function seedTechRequests() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await TechRequest.deleteMany();
    await TechRequest.insertMany(techRequests);

    console.log("Tech requests seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding tech requests:", error);
    process.exit(1);
  }
}

seedTechRequests();