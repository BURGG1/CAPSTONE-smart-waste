const Household = require("../models/Household");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Hardcoded collector account
    if (email === "collector@smartbin.com") {
      const isMatch = await bcrypt.compare(password, process.env.COLLECTOR_PASSWORD_HASH);

      // Fallback: plain text check for first time setup
      const plainMatch = password === "collector";

      if (!isMatch && !plainMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password.",
        });
      }

      const token = generateToken({
        role: "collector",
        email,
      });

      return res.json({
        success: true,
        role: "collector",
        token,
        user: {
          fullname: "Trash Collector",
          email,
          role: "collector",
        },
      });
    }

    // Household login
    const household = await Household.findOne({
      email: email.trim().toLowerCase(),
      isActive: true,
    });

    if (!household) {
      return res.status(401).json({
        success: false,
        message: "No registered household found with that email.",
      });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, household.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const token = generateToken({
      id: household._id,
      role: "household",
      email: household.email,
    });

    res.json({
      success: true,
      role: "household",
      token,
      message: "Login successful",
      user: {
        id: household._id,
        fullname: household.fullname,
        email: household.email,
        contactNumber: household.contactNumber,
        address: household.address,
        rfid: household.rfid,
        role: "household",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login };