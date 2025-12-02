const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

console.log("📦 Initializing Express app...");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// TEST ROUTE - để kiểm tra server hoạt động
app.get("/api/test", (req, res) => {
  console.log("✅ Test route hit!");
  res.json({ message: "Server is working!" });
});

console.log("🛣️ Registering routes...");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

console.log("🔗 Connecting to database...");
const sequelize = require("./config/db");

// Đơn giản hóa sync - không load models ở đây
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connection established");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("✅ Database synced");
  })
  .catch((err) => {
    console.error("❌ Database error:", err.message);
    console.error(err.stack);
  });

console.log("✅ App initialization complete");

module.exports = app;
