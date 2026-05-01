const express = require("express");
const router = express.Router();
const BuildingComment = require("../models/BuildingComment");

// GET all comments/stories
router.get("/", async (req, res) => {
  try {
    const comments = await BuildingComment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET comments/stories for one location
router.get("/:locationId", async (req, res) => {
  try {
    const comments = await BuildingComment.find({
      locationId: req.params.locationId,
    }).sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new story/comment
router.post("/", async (req, res) => {
  try {
    const newComment = new BuildingComment(req.body);
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH like/unlike
router.patch("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;

    const comment = await BuildingComment.findById(req.params.id);

    if (!comment.likes.includes(userId)) {
      comment.likes.push(userId);
    } else {
      comment.likes = comment.likes.filter((id) => id !== userId);
    }

    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;