// src/routes/staffRoutes.js - Routes cho LE_TAN
const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const staffController = require("../controllers/staffController");

// Middleware: Chỉ cho phép Lễ Tân
const staffOnly = (req, res, next) => {
  verifyToken(req, res, () => {
    checkRole(["LE_TAN"])(req, res, next);
  });
};

// Lịch làm việc
router.get("/schedule", staffOnly, staffController.getMySchedule);

// Quản lý đơn đặt hẹn
router.get("/bookings", staffOnly, staffController.getShopBookings);
router.put("/bookings/:id/confirm", staffOnly, staffController.confirmBooking);
router.put(
  "/bookings/:id/assign-technician",
  staffOnly,
  staffController.assignTechnician
);
router.put(
  "/bookings/:id/status",
  staffOnly,
  staffController.updateBookingStatus
);

// Khách hàng
router.get("/customers", staffOnly, staffController.getShopCustomers);

module.exports = router;
