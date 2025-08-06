// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pushNotificationToken: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
