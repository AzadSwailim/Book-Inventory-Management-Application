const express = require("express");
const { getAllBooks, 
        getBookById, 
        createBook, 
        updateBook, 
        deleteBook 
      } = require("../controllers/book.controller");
const validateCreate = require("../middleware/validateCreate.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/uploads.middleware");
const validateUpdate = require("../middleware/ValidateUpdate.middleware");
const asyncHandler = require("../utils/asyncHandler");
const router = express.Router();
router.get("/", asyncHandler(getAllBooks));
router.get("/:id", asyncHandler(getBookById));
router.post("/", authMiddleware, upload.single("coverImage"), validateCreate, asyncHandler(createBook));
router.put("/:id", authMiddleware, upload.single("coverImage"), validateUpdate, asyncHandler(updateBook));
router.delete("/:id", authMiddleware, upload.single("coverImage"), asyncHandler(deleteBook));
router.patch("/:id/restock", authMiddleware, restockBook);
module.exports = router;