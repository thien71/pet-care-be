const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");

console.log("📦 Initializing Express app...");

const app = express();

// ⭐ CORS phải được config TRƯỚC helmet
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

// ⭐ Helmet với CSP config để cho phép load images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

app.use(morgan("dev"));
app.use(express.json());

// ⭐ SERVE STATIC FILES - Phải config TRƯỚC routes
// Cho phép access /uploads từ frontend
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
console.log("📁 Static files served from:", path.join(__dirname, "../uploads"));

// TEST ROUTE - để kiểm tra server hoạt động
app.get("/api/test", (req, res) => {
  console.log("✅ Test route hit!");
  res.json({ message: "Server is working!" });
});

// ⭐ Test endpoint để check uploads
app.get("/api/test-upload", (req, res) => {
  const fs = require("fs");
  const uploadsPath = path.join(__dirname, "../uploads");
  const avatarsPath = path.join(__dirname, "../uploads/avatars");

  const result = {
    uploadsFolder: {
      exists: fs.existsSync(uploadsPath),
      path: uploadsPath,
      files: fs.existsSync(uploadsPath)
        ? fs.readdirSync(uploadsPath).slice(0, 5)
        : [],
    },
    avatarsFolder: {
      exists: fs.existsSync(avatarsPath),
      path: avatarsPath,
      files: fs.existsSync(avatarsPath)
        ? fs.readdirSync(avatarsPath).slice(0, 5)
        : [],
    },
  };

  res.json(result);
});

console.log("🛣️ Registering routes...");
routes(app);

app.use(errorHandler);

console.log("🔗 Connecting to database...");
const sequelize = require("./config/db");

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connection established");
  })
  .catch((err) => {
    console.error("❌ Database error:", err.message);
    console.error(err.stack);
  });

module.exports = app;
