const express = require("express");
const router = express.Router();
const Bin = require("../models/Bin");

// ─── Helper: auto-generate next Bin ID ────────────────────────────────────────
async function generateBinId() {
  const last = await Bin.findOne().sort({ createdAt: -1 }).select("binId");
  if (!last) return "BIN-001";
  const num = parseInt(last.binId.split("-")[1], 10) + 1;
  return `BIN-${String(num).padStart(3, "0")}`;
}

// ─── GET all bins ──────────────────────────────────────────────────────────────
// GET /api/bins
// Optional query: ?type=Biodegradable  ?search=BIN-001
router.get("/", async (req, res) => {
  try {
    const { type, search } = req.query;
    const query = {};

    if (type && type !== "all") {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { binId: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const bins = await Bin.find(query).sort({ createdAt: 1 });
    res.json({ success: true, data: bins });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET single bin ────────────────────────────────────────────────────────────
// GET /api/bins/:id
router.get("/:id", async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    if (!bin) return res.status(404).json({ success: false, message: "Bin not found" });
    res.json({ success: true, data: bin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST create bin ───────────────────────────────────────────────────────────
// POST /api/bins
// Body: { name, type, capacity, location, lat?, lng? }
router.post("/", async (req, res) => {
  try {
    const { name, type, capacity, location, lat, lng } = req.body;

    if (!name || !type || !capacity || !location) {
      return res.status(400).json({
        success: false,
        message: "name, type, capacity, and location are required.",
      });
    }

    const binId = await generateBinId();

    const bin = new Bin({
      binId,
      name,
      type,
      capacity,
      location,
      lat: lat || null,
      lng: lng || null,
      lastEmptied: null,
      fill: 0,
    });

    await bin.save();
    res.status(201).json({ success: true, data: bin });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Bin ID already exists." });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT update bin ────────────────────────────────────────────────────────────
// PUT /api/bins/:id
// Body: any updatable fields (name, type, capacity, location, fill, lastEmptied)
router.put("/:id", async (req, res) => {
  try {
    const allowedFields = ["name", "type", "capacity", "location", "fill", "lastEmptied", "lat", "lng"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
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

// ─── DELETE bin ────────────────────────────────────────────────────────────────
// DELETE /api/bins/:id
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