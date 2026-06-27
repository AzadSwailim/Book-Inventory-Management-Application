const express = require ("express");
const cors = require("cors");
const app = express();
const logger = require("./middleware/logger.middleware");
const bookRoutes = require("./routes/book.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middleware/error.middleware");
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-inventory-management-applicati.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(logger);
app.use("/books", bookRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);
app.use(errorHandler);
module.exports = app;