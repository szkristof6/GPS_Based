const mongoose = require("mongoose");

const objectSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      max: 255,
    },
    location: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    },
    radius: {
      type: Number,
      required: true,
      min: 0,
    },
    game_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Object", objectSchema);
