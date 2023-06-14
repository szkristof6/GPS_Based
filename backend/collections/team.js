const { database } = require("../mongodb");

module.exports = database.collection('team');
/*

const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);

*/