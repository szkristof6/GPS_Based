const { database } = require("../mongodb");

module.exports = database.collection('moderator');

/*
const mongoose = require("mongoose");

const moderatorSchema = new mongoose.Schema(
  {
    game_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    permission: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Moderator", moderatorSchema);

*/