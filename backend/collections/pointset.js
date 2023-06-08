const mongoose = require("mongoose");

const pointSetSchema = new mongoose.Schema(
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
  { timestamps: true }
);

module.exports = mongoose.model("PointSet", pointSetSchema);
