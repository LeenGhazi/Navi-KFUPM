const express = require("express");
const AboutPage = require("../models/AboutPage");

const router = express.Router();

// GET About page data
// Example: /api/about-page
router.get("/", async (req, res) => {
  try {
    const aboutPage = await AboutPage.findOne({ pageId: "about-page" });

    if (!aboutPage) {
      return res.status(404).json({ message: "About page data not found" });
    }

    res.status(200).json(aboutPage);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch About page data",
      error: error.message,
    });
  }
});

module.exports = router;