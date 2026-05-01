const express = require("express");
const router = express.Router();
const TechRequest = require("../models/TechRequest");


// GET all requests
router.get("/", async (req, res) => {
  try {
    const requests = await TechRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST create new request
router.post("/", async (req, res) => {
  try {
    const newRequest = new TechRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// PATCH update status (for technical team)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, notes, techResponse } = req.body;

    const updated = await TechRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes,
        techResponse: techResponse || notes,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// POST add follow-up comment
router.post("/:id/comment", async (req, res) => {
  try {
    const { message, sender } = req.body;

    const updated = await TechRequest.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          followUps: {
            message,
            sender,
          },
        },
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;