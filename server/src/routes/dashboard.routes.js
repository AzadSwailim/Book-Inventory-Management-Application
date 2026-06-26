const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { getDashboard } = require("../controllers/dashboard.controller");
router.get("/",asyncHandler(getDashboard));
module.exports = router;