const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { getActivities } = require("../controllers/activity.controller");

router.get("/", asyncHandler(getActivities));

module.exports = router;
