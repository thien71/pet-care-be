const dotenv = require("dotenv");
dotenv.config();

console.log("🚀 Starting server...");
console.log("📝 Environment variables loaded");
console.log(
  "🔑 JWT_SECRET:",
  process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing"
);
console.log(
  "🗄️ DATABASE_URL:",
  process.env.DATABASE_URL ? "✅ Loaded" : "❌ Missing"
);

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/api/auth/login`);
});
