const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Reward = require("../models/Reward");
const upload = require("../middleware/upload");

// GET /api/rewards - list all rewards
router.get("/", async (req, res) => {
  try {
    const rewards = await Reward.find().sort({ createdAt: -1 });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/rewards/:id - single reward
router.get("/:id", async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) return res.status(404).json({ message: "Reward not found" });
    res.json(reward);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/rewards - create reward (multipart/form-data: name, points, stocks, image)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, points, stocks } = req.body;

    if (!name || points === undefined || stocks === undefined) {
      return res
        .status(400)
        .json({ message: "Name, points, and stocks are required" });
    }

    const reward = new Reward({
      name,
      points: Number(points),
      stocks: Number(stocks),
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    const saved = await reward.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/rewards/:id - update reward (any field optional, image optional)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) return res.status(404).json({ message: "Reward not found" });

    const { name, points, stocks } = req.body;

    if (name !== undefined) reward.name = name;
    if (points !== undefined) reward.points = Number(points);
    if (stocks !== undefined) reward.stocks = Number(stocks);

    if (req.file) {
      // delete old image file if one exists
      if (reward.image) {
        fs.unlink(path.join(__dirname, "..", reward.image), () => {});
      }
      reward.image = `/uploads/${req.file.filename}`;
    }

    const updated = await reward.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/rewards/:id
router.delete("/:id", async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) return res.status(404).json({ message: "Reward not found" });

    if (reward.image) {
      fs.unlink(path.join(__dirname, "..", reward.image), () => {});
    }

    await reward.deleteOne();
    res.json({ message: "Reward deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;