const express = require("express");
const router = express.Router();
const BuildingReview = require("../models/BuildingReview");

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await BuildingReview.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET reviews for one location
router.get("/:locationId", async (req, res) => {
  try {
    const reviews = await BuildingReview.find({
      locationId: req.params.locationId,
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new review
router.post("/", async (req, res) => {
  try {
    const newReview = new BuildingReview(req.body);
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH edit review
router.patch("/:id", async (req, res) => {
  try {
    const updated = await BuildingReview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE review
router.delete("/:id", async (req, res) => {
  try {
    await BuildingReview.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;