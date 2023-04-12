const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    max: 255,
  },
  password: {
    type: String,
    required: false,
    min: 10,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    max: 255,
    min: 3,
  },
  login_method: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  permission: {
    type: Number,
    required: true,
    min: -1,
    max: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
