const express = require("express");
const router  = express.Router();
const Bin     = require("../models/Bin");
const { dispose, getAllBins, createBin, updateBin, deleteBin, getBinCount, heartbeat } = require("../controllers/binController");


router.post("/heartbeat", heartbeat);   

// ── Must be before /:id routes ────────────────────────────────────────────────
router.post("/dispose",          dispose);
router.post("/update-location", async (req, res) => {
  try {
    const { binId, lat, lng } = req.body;

    if (!binId || lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: "binId, lat, lng required" });
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      return res.status(400).json({ success: false, message: "lat and lng must be valid numbers" });
    }

    const bin = await Bin.findOneAndUpdate(
      { binId },
      { lat: latNum, lng: lngNum },
      { new: true }
    );

    if (!bin) {
      return res.status(404).json({ success: false, message: "Bin not found" });
    }

    res.json({ success: true, message: "Location updated", data: { binId, lat: latNum, lng: lngNum } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// ── Collection routes ─────────────────────────────────────────────────────────
router.get("/",    getAllBins);
router.post("/",   createBin);

router.get("/count", getBinCount);

// ── Single bin routes ─────────────────────────────────────────────────────────
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
    const bin = await Bin.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
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