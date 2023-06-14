const { database } = require("../mongodb");

module.exports = database.collection('object');
/*
const mongoose = require("mongoose");

const objectSchema = new mongoose.Schema(
  {
    map_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    objects: [
      {
        type: {
          type: String,
          required: true,
        },
        team_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
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
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Object", objectSchema);

*/