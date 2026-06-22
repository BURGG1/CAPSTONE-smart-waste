const Household = require("../models/Household");
const RfidLog = require("../models/RfidLog");

// GET /api/households
const getAllHouseholds = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, isActive } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { contactNumber: { $regex: search, $options: "i" } },
        { rfid: { $regex: search, $options: "i" } },
        { "address.houseNo": { $regex: search, $options: "i" } },
        { "address.street": { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [households, total] = await Promise.all([
      Household.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Household.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: households,
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

// GET /api/households/:id
const getHouseholdById = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);
    if (!household)
      return res.status(404).json({ success: false, message: "Household not found" });

    res.json({ success: true, data: household });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/households
const createHousehold = async (req, res) => {
  try {
    const { fullname, birthday, familyMember, address, contactNumber, email, rfid } = req.body;

    const existingRfid = await Household.findOne({ rfid });
    if (existingRfid) {
      return res.status(409).json({
        success: false,
        message: `RFID "${rfid}" is already assigned to another household`,
      });
    }

    const household = await Household.create({
      fullname,
      birthday: birthday || null,
      familyMember: familyMember || null,
      address: {
        houseNo: address?.houseNo || null,
        street: address?.street || null,
      },
      contactNumber,
      email: email || null,
      rfid,
    });

    await RfidLog.create({
      rfid,
      household: household._id,
      action: "assign",
      note: `Assigned to ${fullname} during registration`,
    });

    res.status(201).json({
      success: true,
      message: "Household registered successfully",
      data: household,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/households/:id
const updateHousehold = async (req, res) => {
  try {
    const { fullname, birthday, familyMember, address, contactNumber, email, rfid } = req.body;

    const household = await Household.findById(req.params.id);
    if (!household)
      return res.status(404).json({ success: false, message: "Household not found" });

    if (rfid && rfid !== household.rfid) {
      const conflict = await Household.findOne({ rfid, _id: { $ne: req.params.id } });
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: `RFID "${rfid}" is already assigned to another household`,
        });
      }

      await RfidLog.create([
        {
          rfid: household.rfid,
          household: household._id,
          action: "unassign",
          note: `Replaced by new RFID ${rfid}`,
        },
        {
          rfid,
          household: household._id,
          action: "assign",
          note: `Reassigned to ${fullname || household.fullname}`,
        },
      ]);
    }

    const updated = await Household.findByIdAndUpdate(
      req.params.id,
      { fullname, birthday, familyMember, address, contactNumber, email, rfid },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: "Household updated successfully", data: updated });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/households/:id (soft delete)
const deleteHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);
    if (!household)
      return res.status(404).json({ success: false, message: "Household not found" });

    household.isActive = false;
    await household.save();

    await RfidLog.create({
      rfid: household.rfid,
      household: household._id,
      action: "unassign",
      note: "Household deactivated",
    });

    res.json({ success: true, message: "Household deactivated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  deleteHousehold,
};