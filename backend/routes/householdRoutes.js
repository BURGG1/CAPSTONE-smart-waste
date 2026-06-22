const express = require("express");
const router = express.Router();
const {
  getAllHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  deleteHousehold,
} = require("../controllers/householdController");

router.route("/").get(getAllHouseholds).post(createHousehold);
router.route("/:id").get(getHouseholdById).put(updateHousehold).delete(deleteHousehold);

module.exports = router;