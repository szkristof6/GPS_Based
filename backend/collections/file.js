const { database } = require("../mongodb");

module.exports = database.collection("file");

// const mongoose = require("mongoose");

/* const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      max: 255,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      max: 255,
    },
    id: {
      type: String,
      required: true,
      trim: true,
      max: 255,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);

*/
