const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    points: { type: Number, required: true, min: 0 },
    stocks: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" }, // e.g. "/uploads/eco-bricks-12345.jpg"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardSchema);