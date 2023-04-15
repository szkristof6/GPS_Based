const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      max: 255,
    },
    game_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    point: {
      type: Number,
      required: true,
      min: 0,
    },
    color: {
      type: String,
      required: true,
      lowercase: true,
      min: 7,
      max: 7,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
