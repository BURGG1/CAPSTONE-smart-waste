const express = require("express");
const router = express.Router();
const { dispose, getAllBins, createBin } = require("../controllers/binController");

router.post("/dispose", dispose);   // ESP32 endpoint — must be before /:id
router.get("/", getAllBins);
router.post("/", createBin);

// Single bin routes
const Bin = require("../models/Bin");

router.get("/:id", async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    if (!bin) return res.status(404).json({ success: false, message: "Bin not found" });
    res.json({ success: true, data: bin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const allowedFields = ["name", "type", "capacity", "location", "fill", "lastEmptied", "lat", "lng"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const bin = await Bin.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true });
    if (!bin) return res.status(404).json({ success: false, message: "Bin not found" });
    res.json({ success: true, data: bin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const bin = await Bin.findByIdAndDelete(req.params.id);
    if (!bin) return res.status(404).json({ success: false, message: "Bin not found" });
    res.json({ success: true, message: `${bin.binId} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;