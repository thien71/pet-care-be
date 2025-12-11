// src/routes/index.js (Backend)
// Dùng file này để đăng ký tất cả routes

const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const ownerRoutes = require("./ownerRoutes");
const userRoutes = require("./userRoutes");
const customerRoutes = require("./customerRoutes");
const bookingRoutes = require("./bookingRoutes");

module.exports = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/owner", ownerRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/customer", customerRoutes);
  app.use("/api/booking", bookingRoutes);
};
