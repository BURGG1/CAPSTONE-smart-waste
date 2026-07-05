const express = require("express");
const router = express.Router();
const {
  getAllHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  deleteHousehold,
  getHouseholdCount,  
} = require("../controllers/householdController");
const { protect, allowRoles } = require("../middleware/authMiddleware");


// All public for admin dashboard
router.route("/")
.get(getAllHouseholds)
.post(createHousehold);              

router.get("/count", getHouseholdCount);

router.route("/:id")
  .get(getHouseholdById)
  .put(updateHousehold)               
  .delete(deleteHousehold);          

module.exports = router;