const { database } = require("../mongodb");

module.exports = database.collection('message');
/*
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      min: 1,
      max: 255,
    },
    game_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiver_type: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Message", messageSchema);
*/