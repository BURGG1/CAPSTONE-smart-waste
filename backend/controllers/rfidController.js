const Household = require("../models/Household");
const RfidLog = require("../models/RfidLog");

// POST /api/rfid/scan
const scanRfid = async (req, res) => {
  try {
    const { rfid } = req.body;

    if (!rfid)
      return res.status(400).json({ success: false, message: "RFID code is required" });

    const household = await Household.findOne({ rfid, isActive: true });

    if (!household) {
      // Still log it — frontend will poll this to auto-fill the field
      await RfidLog.create({
        rfid,
        household: null,
        action: "scan",
        note: "Unregistered RFID scanned — pending registration",
      });
      return res.status(404).json({
        success: false,
        message: "RFID not registered",
        rfid, // 👈 send the UID back so frontend can use it
      });
    }

    await RfidLog.create({
      rfid,
      household: household._id,
      action: "scan",
      note: "Entry scan",
    });

    res.json({
      success: true,
      message: "RFID recognized",
      data: {
        household: {
          id: household._id,
          fullname: household.fullname,
          address: household.address,
          familyMember: household.familyMember,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/rfid/check/:rfid
const checkRfid = async (req, res) => {
  try {
    const existing = await Household.findOne({ rfid: req.params.rfid });
    if (existing) {
      return res.json({
        success: true,
        available: false,
        message: `RFID is already assigned to ${existing.fullname}`,
      });
    }
    res.json({ success: true, available: true, message: "RFID is available" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/rfid/latest-scan
// Frontend polls this to auto-fill the RFID input when ESP32 scans a card
const getLatestScan = async (req, res) => {
  try {
    const latest = await RfidLog.findOne({ action: "scan", household: null })
      .sort({ scannedAt: -1 });

    if (!latest) {
      return res.json({ success: false, message: "No pending scan" });
    }

    // Only return scans from the last 3 seconds (fresh scans only)
    const threeSecondsAgo = new Date(Date.now() - 3000);
    if (latest.scannedAt < threeSecondsAgo) {
      return res.json({ success: false, message: "No recent scan" });
    }

    res.json({ success: true, rfid: latest.rfid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/rfid/logs
const getRfidLogs = async (req, res) => {
  try {
    const { rfid, action, page = 1, limit = 20 } = req.query;
    const query = {};
    if (rfid) query.rfid = rfid;
    if (action) query.action = action;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [logs, total] = await Promise.all([
      RfidLog.find(query)
        .populate("household", "fullname address contactNumber")
        .sort({ scannedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      RfidLog.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/rfid/logs/:rfid
const getRfidHistory = async (req, res) => {
  try {
    const logs = await RfidLog.find({ rfid: req.params.rfid })
      .populate("household", "fullname address")
      .sort({ scannedAt: -1 });

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { scanRfid, checkRfid, getLatestScan, getRfidLogs, getRfidHistory };