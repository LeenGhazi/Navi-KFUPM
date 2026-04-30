const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// GET all complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// CREATE complaint
router.post("/", async (req, res) => {
  try {
    const complaint = await Complaint.create(req.body);
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE complaint status and notes
router.put("/:id/status", async (req, res) => {
  try {
    const { status, notes } = req.body;

    const complaint = await Complaint.findOneAndUpdate(
      { id: req.params.id },
      {
        status,
        notes,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ASSIGN complaint to maintenance staff
router.put("/:id/assign", async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const complaint = await Complaint.findOneAndUpdate(
      { id: req.params.id },
      {
        assignedTo,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;