const mongoose = require("mongoose");

const techRequestSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Rejected"],
      default: "Pending",
    },

    submittedBy: {
      type: String,
      default: "Admin User",
    },

    affectedServices: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    workingHours: {
      type: String,
      default: "",
    },

    contacts: {
      type: String,
      default: "",
    },

    attachments: {
      type: String,
      default: "",
    },

    techResponse: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    followUps: [
      {
        message: String,
        sender: {
          type: String,
          default: "Admin",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TechRequest", techRequestSchema);