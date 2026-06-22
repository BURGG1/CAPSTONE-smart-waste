const express = require("express");
const router = express.Router();
const { scanRfid, checkRfid, getRfidLogs, getRfidHistory, getLatestScan } = require("../controllers/rfidController");

router.post("/scan", scanRfid);
router.get("/check/:rfid", checkRfid);
router.get("/latest-scan", getLatestScan)
router.get("/logs", getRfidLogs);
router.get("/logs/:rfid", getRfidHistory);

module.exports = router;