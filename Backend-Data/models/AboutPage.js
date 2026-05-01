const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    icon: { type: String },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const aboutPageSchema = new mongoose.Schema(
  {
    pageId: {
      type: String,
      required: true,
      unique: true,
      default: "about-page",
    },

    hero: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
    },

    introduction: {
      title: { type: String, required: true },
      paragraphs: [{ type: String }],
    },

    keyFeatures: [itemSchema],

    userRoles: [itemSchema],

    buildingFacilities: {
      title: { type: String, required: true },
      description: { type: String },
      facilities: [itemSchema],
    },

    technology: {
      title: { type: String, required: true },
      description: { type: String },
      tools: [{ type: String }],
    },

    gettingStarted: {
      title: { type: String, required: true },
      description: { type: String },
      steps: [{ type: String }],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutPage", aboutPageSchema);