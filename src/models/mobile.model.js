const mongoose = require("mongoose");

const mobileSchema = new mongoose.Schema({
  title: { type: String },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  category: { type: String },
  images: [{ type: String }],
  description: { type: String },
  price: { type: Number },
  brand:{ type: String }
});

module.exports = mongoose.model("mobile", mobileSchema);
