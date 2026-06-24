require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Collector = require("./models/Collector");
const connectDB = require("./config/db");

const seed = async () => {
  await connectDB();

  const existing = await Collector.findOne({ email: "chitomid@gmail.com" });
  if (existing) {
    console.log("Collector already exists. Skipping.");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("collector123", 10);

  await Collector.create({
    name: "Chito Miranda",
    employeeId: "EMP-00045",
    assignedBarangay: "Barangay Sunshine",
    contact: "+63 917 888 2233",
    email: "chitomid@gmail.com",
    password: hashedPassword,
    totalCollections: 120,
  });

  console.log("✅ Collector seeded successfully!");
  console.log("Email: chitomid@gmail.com");
  console.log("Password: collector123");
  process.exit();
};

seed();