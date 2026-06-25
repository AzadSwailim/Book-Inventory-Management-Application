const express = require("express");
const { getAllBooks, 
        getBookById, 
        createBook, 
        updateBook, 
        deleteBook 
      } = require("../controllers/book.controller");
const validateCreate = require("../middleware/validateCreate.middleware");
const validateUpdate = require("../middleware/ValidateUpdate.middileware");
const asyncHandler = require("../utils/asyncHandler");const router = express.Router();
router.get("/", asyncHandler(getAllBooks));
router.get("/:id", asyncHandler(getBookById));
router.post("/", validateCreate, asyncHandler(createBook));
router.put("/:id", validateUpdate, asyncHandler(updateBook));
router.delete("/:id", asyncHandler(deleteBook));
module.exports = router;