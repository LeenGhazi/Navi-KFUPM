const express = require("express");
const User = require("../models/User");

const router = express.Router();

// GET demo users WITHOUT passwords
router.get("/demo", async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["admin", "maintenance_staff", "student"] },
    }).select("name email role");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch demo users",
      error: error.message,
    });
  }
});

// REGISTER regular user only
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "student",
    });

    res.status(201).json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

// LOGIN all roles
router.post("/login", async (req, res) => {
  try {
    const { email, password, loginType } = req.body;

    if (!email || !password || !loginType) {
      return res.status(400).json({
        message: "Email, password, and login type are required",
      });
    }

    const expectedRoleMap = {
      user: "student",
      admin: "admin",
      technical_admin: "maintenance_staff",
    };

    const expectedRole = expectedRoleMap[loginType];

    if (!expectedRole) {
      return res.status(400).json({
        message: "Invalid login type",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (user.role !== expectedRole) {
      return res.status(403).json({
        message: "These credentials do not have access to this login type",
      });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

module.exports = router;