const express = require("express");
const { getAllBooks, 
        getBookById, 
        createBook, 
        updateBook, 
        deleteBook 
      } = require("../controllers/book.controller");
const validateCreate = require("../middleware/validateCreate.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const validateUpdate = require("../middleware/ValidateUpdate.middleware");
const asyncHandler = require("../utils/asyncHandler");
const router = express.Router();
router.get("/", asyncHandler(getAllBooks));
router.get("/:id", asyncHandler(getBookById));
router.post("/", authMiddleware, validateCreate, asyncHandler(createBook));
router.put("/:id", authMiddleware, validateUpdate, asyncHandler(updateBook));
router.delete("/:id", authMiddleware, asyncHandler(deleteBook));
module.exports = router;