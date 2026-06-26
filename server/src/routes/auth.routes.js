const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { getRegister, getLogin } = require("../controllers/auth.controller");
router.post("/register", asyncHandler(getRegister));
router.post("/login", asyncHandler(getLogin));
module.exports = router;