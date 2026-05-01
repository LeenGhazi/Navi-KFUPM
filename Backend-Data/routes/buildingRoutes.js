const express = require("express");
const router = express.Router();
const Building = require("../models/Building");

// GET all buildings
router.get("/", async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json(buildings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one building by frontend id, example: loc1
router.get("/:id", async (req, res) => {
  try {
    const building = await Building.findOne({ id: req.params.id });

    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    res.json(building);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE building details
router.put("/:id", async (req, res) => {
  try {
    const building = await Building.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );

    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    res.json(building);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;