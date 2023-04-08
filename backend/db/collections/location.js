const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
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
  player_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  game_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Location", locationSchema);
