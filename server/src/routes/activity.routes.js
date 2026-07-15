const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middleware/auth.middleware");
const { getActivities, deleteActivity } = require("../controllers/activity.controller");

router.get("/", asyncHandler(getActivities));
router.delete("/:id", authMiddleware, asyncHandler(deleteActivity));

module.exports = router;
