const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      min: 16,
      max: 16,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      max: 255,
    },
    desc: {
      type: String,
      required: true,
      max: 200,
    },
    password: {
      type: String,
      required: true,
      min: 10,
      max: 255,
    },
    gamemode: {
      type: String,
      required: false,
      trim: true,
    },
    location: {
      x: {
        type: Number,
        required: false,
      },
      y: {
        type: Number,
        required: false,
      },
    },
    map_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
