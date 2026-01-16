const dotenv = require("dotenv");
const fs = require("fs"); // Thêm dòng này
const path = require("path"); // Thêm dòng này
dotenv.config();

// Tạo folder uploads nếu chưa có
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

console.log("Starting server...");
console.log("Environment variables loaded");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Missing");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Loaded" : "Missing");

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/auth/login`);
});

// Khởi động cron jobs
if (process.env.ENABLE_CRON_JOBS === "true") {
  require("./src/jobs/checkExpiredShops");
  console.log("Cron jobs started");
}
