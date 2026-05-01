const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Announcement = require("../models/Announcement");

dotenv.config();

const announcements = [
  {
    title: "Mid-Term Exam Schedule Released",
    content: "The mid-term exam schedule for semester 242 has been released. Please check the student portal for your exam times and locations.",
    category: "Academic",
    date: new Date("2026-04-15"),
    priority: "high",
  },
  {
    title: "Campus Maintenance Notice",
    content: "Building 24 will be under maintenance from April 20-22. Alternative study rooms are available in Building 31.",
    category: "Facilities",
    date: new Date("2026-04-18"),
    priority: "medium",
  },
  {
    title: "New Bus Route Added",
    content: "A new bus route has been added connecting the female dormitories to the main academic area. Service starts May 1st.",
    category: "Transportation",
    date: new Date("2026-04-20"),
    priority: "medium",
  },
  {
    title: "Library Extended Hours",
    content: "The main library will be open 24 hours during the final exam period from May 10-25.",
    category: "Academic",
    date: new Date("2026-04-25"),
    priority: "low",
  },
  {
    title: "Research Day 2026",
    content: "KFUPM Research Day will be held on May 5th. All students and faculty are welcome to attend and present their research.",
    category: "Events",
    date: new Date("2026-04-28"),
    priority: "high",
  },
];

const seedAnnouncements = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Announcement.deleteMany();
    console.log("Old announcements deleted");

    await Announcement.insertMany(announcements);
    console.log("Announcements seeded successfully!");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding announcements:", error);
    mongoose.connection.close();
  }
};

seedAnnouncements();