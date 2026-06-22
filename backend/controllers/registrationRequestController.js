const RegistrationRequest = require("../models/RegistrationRequest");

// POST /api/requests  — mobile app submits registration
const createRequest = async (req, res) => {
  try {
    const { fullname, familyMember, address, email } = req.body;

    if (!fullname) {
      return res.status(400).json({ success: false, message: "Fullname is required." });
    }

    const request = await RegistrationRequest.create({
      fullname,
      familyMember: familyMember || null,
      address: {
        houseNo: address?.houseNo || null,
        street: address?.street || null,
      },
      email: email || null,
    });

    res.status(201).json({
      success: true,
      message: "Registration request submitted. Please wait for admin approval.",
      data: request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/requests  — admin fetches all requests
const getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const requests = await RegistrationRequest.find(query).sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/requests/:id/status  — admin approves or declines
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const request = await RegistrationRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found." });
    }

    res.json({ success: true, message: `Request ${status}.`, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createRequest, getAllRequests, updateRequestStatus };