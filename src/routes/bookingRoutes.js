// src/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const bookingController = require("../controllers/bookingController");
const { checkShopActive } = require("../middlewares/shopStatusMiddleware");

// ==================== PUBLIC ROUTES ====================
router.get("/slots/:shopId", bookingController.getAvailableSlots);

// ==================== CUSTOMER ====================
router.post("/", verifyToken, checkRole(["KHACH_HANG"]), bookingController.createBooking);
router.get("/my", verifyToken, checkRole(["KHACH_HANG"]), bookingController.getMyBookings);

// ==================== STAFF/OWNER ====================
router.get("/shop", verifyToken, checkRole(["CHU_CUA_HANG", "LE_TAN"]), checkShopActive, bookingController.getShopBookings);
router.put("/:id/confirm", verifyToken, checkRole(["CHU_CUA_HANG", "LE_TAN"]), checkShopActive, bookingController.confirmBooking);
router.put("/:id/assign", verifyToken, checkRole(["CHU_CUA_HANG", "LE_TAN"]), checkShopActive, bookingController.assignTechnician);
router.put("/:id/status", verifyToken, checkRole(["CHU_CUA_HANG", "LE_TAN"]), checkShopActive, bookingController.updateBookingStatus);

// ==================== TECHNICIAN ====================
router.get("/my-assignments", verifyToken, checkRole(["KY_THUAT_VIEN"]), bookingController.getMyAssignments);
router.put("/:id/my-assignment", verifyToken, checkRole(["KY_THUAT_VIEN"]), bookingController.updateMyAssignment);

module.exports = router;
