const { database } = require("../mongodb");

module.exports = database.collection('location');
/*
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);
*/