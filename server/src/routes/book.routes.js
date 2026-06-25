const express = require("express");
const { getAllBooks, 
        getBookById, 
        createBook, 
        updateBook, 
        deleteBook 
      } = require("../controllers/book.controller");
const validateBook = require("../middleware/validation.middleware");
const asyncHandler = require("../utils/asyncHandler");
const router = express.Router();
router.get("/", asyncHandler(getAllBooks));
router.get("/:id", asyncHandler(getBookById));
router.post("/", validateBook, asyncHandler(createBook));
router.put("/:id", validateBook, asyncHandler(updateBook));
router.delete("/:id", asyncHandler(deleteBook));
module.exports = router;