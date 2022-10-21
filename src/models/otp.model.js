const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp: { type: String },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("otp", otpSchema);
