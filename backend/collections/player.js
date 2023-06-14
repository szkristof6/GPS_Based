const { database } = require("../mongodb");

module.exports = database.collection('player');
/*
const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    game_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    location_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    point: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);

*/