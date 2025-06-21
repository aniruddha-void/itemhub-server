const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  coverImage: String,
  images: [String],
}, { timestamps: true });
module.exports = mongoose.model("Item", itemSchema);
