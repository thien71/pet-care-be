// src/routes/index.js
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const shopRoutes = require("./shopRoutes");
const serviceRoutes = require("./serviceRoutes");
const bookingRoutes = require("./bookingRoutes");
const paymentRoutes = require("./paymentRoutes");
const staffRoutes = require("./staffRoutes");

module.exports = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/shops", shopRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/staff", staffRoutes);
};
