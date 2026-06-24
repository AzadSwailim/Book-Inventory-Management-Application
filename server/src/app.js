const express = require ("express");
const app = express();
const logger = require("./middleware/logger.middleware");
const validateBook = require("./middleware/validation.middleware");
const bookRoutes = require("./routes/book.routes");
app.use(express.json());
app.use(logger);
app.use("/books", bookRoutes);
module.exports = app;