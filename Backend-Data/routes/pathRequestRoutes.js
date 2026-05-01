const express = require("express");
const router = express.Router();
const PathRequest = require("../models/PathRequest");


router.get("/", async (req, res) => {
  try {
    const pathRequests = await PathRequest.find();
    res.json(pathRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const pathRequest = new PathRequest(req.body);
    const saved = await pathRequest.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.patch("/:id", async (req, res) => {
  try {
    const updated = await PathRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await PathRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Path request deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;