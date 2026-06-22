const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Rule = require("../models/Rule");
const upload = require("../middleware/upload");

// GET /api/rules - list all rules
router.get("/", async (req, res) => {
  try {
    const rules = await Rule.find().sort({ createdAt: -1 });
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/rules/:id - single rule
router.get("/:id", async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);
    if (!rule) return res.status(404).json({ message: "Rule not found" });
    res.json(rule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/rules - create rule (multipart/form-data: name, decs, points, freq, auto, image)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, decs, points, freq, auto } = req.body;

    if (!name || !decs || !points || !freq) {
      return res
        .status(400)
        .json({ message: "Name, description, points, and frequency are required" });
    }

    const rule = new Rule({
      name,
      decs,
      points,
      freq,
      auto: auto === "true" || auto === true,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    const saved = await rule.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/rules/:id - update rule (any field optional, image optional)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);
    if (!rule) return res.status(404).json({ message: "Rule not found" });

    const { name, decs, points, freq, auto } = req.body;

    if (name !== undefined) rule.name = name;
    if (decs !== undefined) rule.decs = decs;
    if (points !== undefined) rule.points = points;
    if (freq !== undefined) rule.freq = freq;
    if (auto !== undefined) rule.auto = auto === "true" || auto === true;

    if (req.file) {
      if (rule.image) {
        fs.unlink(path.join(__dirname, "..", rule.image), () => {});
      }
      rule.image = `/uploads/${req.file.filename}`;
    }

    const updated = await rule.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/rules/:id
router.delete("/:id", async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);
    if (!rule) return res.status(404).json({ message: "Rule not found" });

    if (rule.image) {
      fs.unlink(path.join(__dirname, "..", rule.image), () => {});
    }

    await rule.deleteOne();
    res.json({ message: "Rule deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;