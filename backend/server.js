require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const householdRoutes = require("./routes/householdRoutes");
const rfidRoutes = require("./routes/rfidRoutes");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const registrationRequestRoutes = require("./routes/registrationRequestRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/households", householdRoutes);
app.use("/api/rfid", rfidRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/requests", registrationRequestRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
});