const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    decs: { type: String, required: true }, // description
    points: { type: String, required: true }, // string to allow ranges like "50-200"
    freq: { type: String, required: true }, // e.g. "per kilo", "per streak"
    auto: { type: Boolean, default: false }, // true = system-awarded (e.g. streaks)
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rule", ruleSchema);