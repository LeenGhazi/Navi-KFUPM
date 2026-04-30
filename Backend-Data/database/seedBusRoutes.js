const dotenv = require("dotenv");
const connectDB = require("../config/db");
const BusRoute = require("../models/BusRoute");

dotenv.config();

const busRoutes = [
  {
    routeId: "route-purple",
    name: "Purple Route",
    type: "female",
    color: "#7E3AF2",
    image: "1-Purple Route.png",
    description: "Female bus route",
    frequency: "Shuttle basis",
    operatingHours: "6:30 AM - 5:30 PM",
    stops: [
      "Female Student Accommodation 900",
      "Clinic Parking 27",
      "Tower Station 312",
      "Building 22",
      "Northern District 319",
      "Cabin 58",
      "Orientation 309",
      "Start 310",
      "Tower Station 312",
      "Building 22",
      "Clinic 314",
      "Female Student Accommodation 900",
    ].map((name, index) => ({ name, order: index + 1 })),
  },
  {
    routeId: "route-pink",
    name: "Pink Route",
    type: "female",
    color: "#EC4899",
    image: "2-Pink Route.png",
    description: "Female bus route",
    frequency: "Shuttle basis",
    operatingHours: "6:30 AM - 5:30 PM",
    stops: [
      "Physical Education 404",
      "Tower Station 312",
      "Building 22",
      "Northern District 319",
      "Cabin 58",
      "Orientation 309",
      "Start 310",
      "Tower Station 312",
      "Building 22",
      "Clinic 314",
      "Physical Education 404",
    ].map((name, index) => ({ name, order: index + 1 })),
  },
  {
    routeId: "route-orange",
    name: "Orange Route",
    type: "female",
    color: "#F59E0B",
    image: "3-Orange Route.png",
    description: "Female bus route",
    frequency: "Shuttle basis",
    operatingHours: "6:30 AM - 5:30 PM",
    stops: [
      "Northern District 319",
      "Cabin 58",
      "Orientation 309",
      "Start 310",
      "Building 22",
      "Tower Station 312",
      "Clinic 314",
      "Tower Station 312",
      "Building 22",
      "Northern District 319",
    ].map((name, index) => ({ name, order: index + 1 })),
  },
  {
    routeId: "route-brown",
    name: "Brown Route",
    type: "female",
    color: "#A16207",
    image: "5-Brown Route.png",
    description: "Female bus route",
    frequency: "Shuttle basis",
    operatingHours: "6:30 AM - 5:30 PM",
    stops: [
      "Start 310",
      "Cabin 58",
      "Orientation 309",
      "Start 310",
    ].map((name, index) => ({ name, order: index + 1 })),
  },
  {
    routeId: "route-red",
    name: "Red Route",
    type: "female",
    color: "#EF4444",
    image: "4-Red Route.png",
    description: "Female bus route",
    frequency: "Shuttle basis",
    operatingHours: "6:30 AM - 5:30 PM",
    stops: [
      "Clinic Parking 27",
      "Female Student Accommodation 900",
      "Physical Education 404",
    ].map((name, index) => ({ name, order: index + 1 })),
  },
  {
    routeId: "route-blue",
    name: "Blue Route",
    type: "male",
    color: "#2563EB",
    image: "6-Blue Route.png",
    description: "Male bus route",
    frequency: "Shuttle basis",
    operatingHours: "6:30 AM - 5:30 PM",
    stops: [
      "Field Station 301",
      "Cooling Stop 302",
      "Heritage Station 303",
      "North Station 304",
      "Reservoir Station 305",
      "Deanship Station 306",
      "Sports Center 311",
      "Petroleum Station 313",
      "Sports Center 311",
      "Deanship Station 306",
      "Reservoir Station 305",
      "North Station 304",
      "Heritage Station 303",
      "Cooling Stop 302",
      "Field Station 301",
    ].map((name, index) => ({ name, order: index + 1 })),
  },
  {
    routeId: "route-cyan",
    name: "Cyan Route",
    type: "male",
    color: "#06B6D4",
    image: "7-Cyan Route.png",
    description: "Male bus route",
    frequency: "Shuttle basis",
    operatingHours: "6:30 AM - 5:30 PM",
    stops: [
      "Heritage Station 303",
      "North Station 304",
      "Mall 308",
      "Heritage Station 303",
    ].map((name, index) => ({ name, order: index + 1 })),
  },
];

const seedBusRoutes = async () => {
  try {
    await connectDB();

    await BusRoute.deleteMany();
    await BusRoute.insertMany(busRoutes);

    console.log("Bus routes seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedBusRoutes();