const mongoose = require("mongoose");
const dotenv = require("dotenv");
const AboutPage = require("../models/AboutPage");

dotenv.config();

const aboutPageData = {
  pageId: "about-page",

  hero: {
    title: "About Navi-KFUPM",
    subtitle: "Your comprehensive campus navigation companion",
  },

  introduction: {
    title: "What is Navi-KFUPM?",
    paragraphs: [
      "Navi-KFUPM is a comprehensive campus navigation system designed specifically for King Fahd University of Petroleum & Minerals. Our platform helps students, faculty, and visitors navigate the campus with ease while building a community through shared experiences.",
      "Whether you're looking for the nearest cafe, planning your route between classes, or wanting to share your favorite campus memories, Navi-KFUPM has you covered.",
    ],
  },

  keyFeatures: [
    {
      title: "Interactive Campus Map",
      description:
        "Explore the campus with color-coded buildings, real-time location tracking, and detailed building information.",
      icon: "Map",
      order: 1,
    },
    {
      title: "Smart Route Planning",
      description:
        "Get multiple route options between locations with distance calculations and accessibility features.",
      icon: "Route",
      order: 2,
    },
    {
      title: "Advanced Search & Filter",
      description:
        "Find locations by category, search by name, and discover nearest facilities based on your needs.",
      icon: "Search",
      order: 3,
    },
    {
      title: "Stories & Memories",
      description:
        "Share your campus experiences, read stories from fellow students, and like your favorite memories.",
      icon: "MessageSquare",
      order: 4,
    },
    {
      title: "Campus Bus Routes",
      description:
        "View bus routes, stops, and arrival times to plan your commute around campus.",
      icon: "Bus",
      order: 5,
    },
    {
      title: "Facility Information",
      description:
        "See detailed facilities in each building including labs, printers, prayer rooms, bathrooms, and study rooms.",
      icon: "Users",
      order: 6,
    },
  ],

  userRoles: [
    {
      title: "Student",
      description:
        "Students can explore the map, share stories and memories about buildings, like stories from other students, submit maintenance complaints, and leave reviews for locations.",
      order: 1,
    },
    {
      title: "System Admin",
      description:
        "System administrators can manage users, moderate content, handle announcements, and oversee the platform's operation.",
      order: 2,
    },
    {
      title: "Maintenance Staff",
      description:
        "Maintenance staff can view and update complaint statuses, ensuring quick response to facility issues reported by students.",
      order: 3,
    },
    {
      title: "Guest",
      description:
        "Guests and visitors can access core map features to navigate the campus without needing to create an account.",
      order: 4,
    },
  ],

  buildingFacilities: {
    title: "Building Facilities",
    description:
      "Each building on our map provides detailed facility information to help you find exactly what you need:",
    facilities: [
      { title: "Computer & Research Labs", order: 1 },
      { title: "Printing Services", order: 2 },
      { title: "Prayer Rooms", order: 3 },
      { title: "Restroom Facilities", order: 4 },
      { title: "Study Rooms", order: 5 },
      { title: "Operating Hours", order: 6 },
    ],
  },

  technology: {
    title: "Technology",
    description:
      "Navi-KFUPM is built with modern web technologies to provide a fast, responsive, and reliable experience:",
    tools: ["React", "TypeScript", "Tailwind CSS", "Vite", "Radix UI", "Lucide Icons"],
  },

  gettingStarted: {
    title: "Get Started",
    description: "Ready to explore KFUPM campus? Here's how to get started:",
    steps: [
      "Use the interactive map to explore different buildings",
      "Click on any building to see detailed information and facilities",
      "Read stories and memories shared by other students",
      "Sign up as a student to share your own experiences and like stories",
      "Use the route planner to find the best path between locations",
      "Filter locations by category to find exactly what you need",
    ],
  },
};

const seedAboutPage = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL);

    await AboutPage.deleteMany({});
    await AboutPage.create(aboutPageData);

    console.log("About page data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding About page data:", error);
    process.exit(1);
  }
};

seedAboutPage();