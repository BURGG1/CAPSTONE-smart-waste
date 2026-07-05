const Household = require("../models/Household");
const RfidLog = require("../models/RfidLog");
const { sendPasswordEmail } = require("../config/mailer");
const bcrypt = require("bcryptjs");

// generates a random 8-character password e.g. "Xk3#mP9q"
const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  return Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

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

    // Generate plain password then hash it
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

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
      password: hashedPassword, // store hashed
    });

    await RfidLog.create({
      rfid,
      household: household._id,
      action: "assign",
      note: `Assigned to ${fullname} during registration`,
    });

    // Send plain password to email
    if (email) {
      await sendPasswordEmail({ to: email, fullname, password: plainPassword });
    }

    res.status(201).json({
      success: true,
      message: email
        ? "Household registered. Login credentials sent to email."
        : "Household registered. No email — credentials not sent.",
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
    const { fullname, birthday, familyMember, address, contactNumber, email, rfid, currentPassword, newPassword } = req.body;

    const household = await Household.findById(req.params.id);
    if (!household)
      return res.status(404).json({ success: false, message: "Household not found" });

    // Handle password change if requested
    if (currentPassword && newPassword) {
      const bcrypt = require("bcryptjs");
      const isMatch = await bcrypt.compare(currentPassword, household.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Current password is incorrect." });
      }
      household.password = await bcrypt.hash(newPassword, 10);
    }

    if (rfid && rfid !== household.rfid) {
      const conflict = await Household.findOne({ rfid, _id: { $ne: req.params.id } });
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: `RFID "${rfid}" is already assigned to another household`,
        });
      }
      await RfidLog.create([
        { rfid: household.rfid, household: household._id, action: "unassign", note: `Replaced by new RFID ${rfid}` },
        { rfid, household: household._id, action: "assign", note: `Reassigned to ${fullname || household.fullname}` },
      ]);
    }

    // Update other fields
    if (fullname) household.fullname = fullname;
    if (birthday) household.birthday = birthday;
    if (familyMember !== undefined) household.familyMember = familyMember;
    if (address) household.address = address;
    if (contactNumber) household.contactNumber = contactNumber;
    if (email) household.email = email;
    if (rfid) household.rfid = rfid;

    await household.save();

    res.json({ success: true, message: "Household updated successfully", data: household });
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

// GET /api/households/count
const getHouseholdCount = async (req, res) => {
  try {
    const count = await Household.countDocuments({ isActive: true });
    res.json({ success: true, count });
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
  getHouseholdCount,
};