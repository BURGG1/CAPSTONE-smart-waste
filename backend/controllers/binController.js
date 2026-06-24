const Bin = require("../models/Bin");
const Disposal = require("../models/Disposal");
const Household = require("../models/Household");

// Helper: auto-generate next Bin ID
async function generateBinId() {
  const last = await Bin.findOne().sort({ createdAt: -1 }).select("binId");
  if (!last) return "BIN-001";
  const num = parseInt(last.binId.split("-")[1], 10) + 1;
  return `BIN-${String(num).padStart(3, "0")}`;
}

// POST /api/bins/dispose
const dispose = async (req, res) => {
  try {
    const { rfid, binId } = req.body;
    if (!rfid || !binId) {
      return res.status(400).json({ success: false, message: "rfid and binId are required." });
    }
    const household = await Household.findOne({ rfid, isActive: true });
    if (!household) {
      return res.status(404).json({ success: false, message: "RFID not registered." });
    }
    const bin = await Bin.findOne({ binId, isActive: true });
    if (!bin) {
      return res.status(404).json({ success: false, message: "Bin not found." });
    }
    const pointsMap = { Biodegradable: 10, "Non-biodegradable": 5, Recyclable: 15 };
    const pointsEarned = pointsMap[bin.type] || 10;
    const disposal = await Disposal.create({
      household: household._id,
      bin: bin._id,
      rfid,
      binId,
      wasteType: bin.type,
      pointsEarned,
    });
    res.json({
      success: true,
      message: `Disposal logged. ${pointsEarned} points earned!`,
      data: {
        household: household.fullname,
        wasteType: bin.type,
        pointsEarned,
        disposedAt: disposal.disposedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/bins
const getAllBins = async (req, res) => {
  try {
    const { type, search } = req.query;
    const query = {};
    if (type && type !== "all") query.type = type;
    if (search) {
      query.$or = [
        { binId: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }
    const bins = await Bin.find(query).sort({ createdAt: 1 });
    res.json({ success: true, data: bins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/bins
const createBin = async (req, res) => {
  try {
    const { name, type, capacity, location, lat, lng } = req.body;
    if (!name || !type || !capacity || !location) {
      return res.status(400).json({
        success: false,
        message: "name, type, capacity, and location are required.",
      });
    }
    const binId = await generateBinId();
    const bin = await Bin.create({
      binId,
      name,
      type,
      capacity,
      location,
      lat: lat || null,
      lng: lng || null,
      fill: 0,
      lastEmptied: null,
    });
    res.status(201).json({ success: true, data: bin });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Bin ID already exists." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { dispose, getAllBins, createBin };