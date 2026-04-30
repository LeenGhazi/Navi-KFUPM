const express = require("express");
const BusRoute = require("../models/BusRoute");

const router = express.Router();

// GET all bus routes
// Example: /api/bus-routes
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;

    const filter = type ? { type } : {};

    const routes = await BusRoute.find(filter).sort({ type: 1, name: 1 });

    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bus routes",
      error: error.message,
    });
  }
});

// GET one bus route by routeId
// Example: /api/bus-routes/route-purple
router.get("/:routeId", async (req, res) => {
  try {
    const route = await BusRoute.findOne({ routeId: req.params.routeId });

    if (!route) {
      return res.status(404).json({ message: "Bus route not found" });
    }

    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bus route",
      error: error.message,
    });
  }
});

module.exports = router;