// ⭐ CẬP NHẬT src/routes/bookingRoutes.js

const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const bookingController = require("../controllers/bookingController");

// ==================== PUBLIC ROUTES ====================
router.get("/public/shops", bookingController.getPublicShops);
router.get("/public/pet-types", bookingController.getPublicPetTypes);
router.get("/public/services", bookingController.getPublicServices);
router.get("/public/top-shops", bookingController.getTopShops);
router.get("/public/shop-services", bookingController.getAllShopServices);
router.get(
  "/public/shop-service/:shopServiceId",
  bookingController.getShopServiceDetail
);
router.get("/service/:serviceId", bookingController.getServiceDetail);
router.get("/shop/:shopId/profile", bookingController.getShopProfile);

// ⭐ THÊM ROUTE MỚI - Lấy khung giờ available
router.get(
  "/shop/:shopId/available-slots",
  bookingController.getAvailableSlots
);

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
