// debug-exports.js (Tạo file này ở root backend/)
console.log("🔍 Checking all controller exports...\n");

try {
  // Check owner controller
  const ownerController = require("./src/controllers/ownerController");
  console.log("✅ Owner Controller exports:");
  console.log(Object.keys(ownerController));
  console.log("");

  // Check admin controller
  const adminController = require("./src/controllers/adminController");
  console.log("✅ Admin Controller exports:");
  console.log(Object.keys(adminController));
  console.log("");

  // Check customer controller
  const customerController = require("./src/controllers/customerController");
  console.log("✅ Customer Controller exports:");
  console.log(Object.keys(customerController));
  console.log("");

  // Check auth controller
  const authController = require("./src/controllers/authController");
  console.log("✅ Auth Controller exports:");
  console.log(Object.keys(authController));
  console.log("");

  console.log("✅ All controllers loaded successfully!");
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error(error.stack);
}
