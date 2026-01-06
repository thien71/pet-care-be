// src/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const paymentController = require("../controllers/paymentController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==================== MULTER CONFIG ====================
const paymentsDir = path.join(__dirname, "../../uploads/payments");
if (!fs.existsSync(paymentsDir)) {
  fs.mkdirSync(paymentsDir, { recursive: true });
}

const paymentStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, paymentsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "payment-proof-" + uniqueSuffix + ext);
  },
});

const uploadPaymentProof = multer({
  storage: paymentStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG) are allowed!"));
    }
  },
});

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
// ==================== OWNER ====================
router.post(
  "/my/upload-proof",
  verifyToken,
  checkRole(["CHU_CUA_HANG"]),
  uploadPaymentProof.single("bienLai"),
  paymentController.uploadPaymentProof
);

module.exports = router;
