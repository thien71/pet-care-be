// src/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const bookingController = require("../controllers/bookingController");

// ==================== CUSTOMER ROUTES ====================
router.get(
  "/shop/:shopId/services/pet-type/:petTypeId",
  verifyToken,
  checkRole(["KHACH_HANG"]),
  bookingController.getShopServicesByPetType
);

router.post(
  "/create",
  verifyToken,
  checkRole(["KHACH_HANG"]),
  bookingController.createBooking
);

router.get(
  "/my-bookings",
  verifyToken,
  checkRole(["KHACH_HANG"]),
  bookingController.getMyBookings
);

// ==================== STAFF/OWNER ROUTES ====================
router.get(
  "/shop-bookings",
  verifyToken,
  checkRole(["CHU_CUA_HANG", "LE_TAN"]),
  bookingController.getShopBookings
);

router.put(
  "/:id/confirm",
  verifyToken,
  checkRole(["CHU_CUA_HANG", "LE_TAN"]),
  bookingController.confirmBooking
);

router.put(
  "/:id/assign-technician",
  verifyToken,
  checkRole(["CHU_CUA_HANG", "LE_TAN"]),
  bookingController.assignTechnician
);

router.put(
  "/:id/status",
  verifyToken,
  checkRole(["CHU_CUA_HANG", "LE_TAN"]),
  bookingController.updateBookingStatus
);

// ==================== TECHNICIAN ROUTES ====================
router.get(
  "/my-assignments",
  verifyToken,
  checkRole(["KY_THUAT_VIEN"]),
  bookingController.getMyAssignments
);

router.put(
  "/:id/my-assignment",
  verifyToken,
  checkRole(["KY_THUAT_VIEN"]),
  bookingController.updateMyAssignment
);

module.exports = router;
