const mongoose = require("mongoose");

const mapCategorySchema = new mongoose.Schema(
  {
    categoryName: String,
    displayLabel: String,
    icon: String,
    color: String,
    order: Number,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MapCategory", mapCategorySchema);