const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      max: 255,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      max: 255,
    },
    id: {
      type: String,
      required: true,
      trim: true,
      max: 255,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
