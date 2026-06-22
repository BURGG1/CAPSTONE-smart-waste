const mongoose = require("mongoose");

const rfidLogSchema = new mongoose.Schema(
  {
    rfid: {
      type: String,
      required: true,
      trim: true,
    },
    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      default: null,
    },
    // "scan" = gate/entry scan | "assign" = registration | "unassign" = removal
    action: {
      type: String,
      enum: ["scan", "assign", "unassign"],
      required: true,
    },
    scannedAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

rfidLogSchema.index({ rfid: 1 });
rfidLogSchema.index({ scannedAt: -1 });

module.exports = mongoose.model("RfidLog", rfidLogSchema);