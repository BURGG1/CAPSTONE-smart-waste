const express = require("express");
const router = express.Router();
const {
  getAllHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  deleteHousehold,
  getHouseholdCount,
  checkEmailExists,
  checkContactExists,
} = require("../controllers/householdController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

// All public for admin dashboard
router.route("/")
  .get(getAllHouseholds)
  .post(createHousehold);

router.get("/count", getHouseholdCount);
router.get("/check-email", checkEmailExists);       // must come before "/:id"
router.get("/check-contact", checkContactExists);   // must come before "/:id"

router.route("/:id")
  .get(getHouseholdById)
  .put(updateHousehold)
  .delete(deleteHousehold);

module.exports = router;