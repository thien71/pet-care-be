// src/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const paymentController = require("../controllers/paymentController");

// ==================== PUBLIC/OWNER - PACKAGES ====================
router.get("/packages", verifyToken, checkRole(["CHU_CUA_HANG", "QUAN_TRI_VIEN"]), paymentController.getPaymentPackages);

// ==================== ADMIN - PACKAGES ====================
router.post("/packages", verifyToken, checkRole(["QUAN_TRI_VIEN"]), paymentController.createPaymentPackage);
router.put("/packages/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), paymentController.updatePaymentPackage);
router.delete("/packages/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), paymentController.deletePaymentPackage);

// ==================== ADMIN - CONFIRMATIONS ====================
router.get("/confirmations", verifyToken, checkRole(["QUAN_TRI_VIEN"]), paymentController.getPaymentConfirmations);
router.put("/confirmations/:id/confirm", verifyToken, checkRole(["QUAN_TRI_VIEN"]), paymentController.confirmPayment);
router.put("/confirmations/:id/reject", verifyToken, checkRole(["QUAN_TRI_VIEN"]), paymentController.rejectPayment);

// ==================== OWNER ====================
router.get("/my", verifyToken, checkRole(["CHU_CUA_HANG"]), paymentController.getMyPayments);
router.post("/purchase", verifyToken, checkRole(["CHU_CUA_HANG"]), paymentController.purchasePackage);

module.exports = router;
