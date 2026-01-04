// src/routes/authRoutes.js (UPDATED)
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ==================== PUBLIC ROUTES ====================

// Đăng ký
router.post("/register", authController.register);

// Xác thực email
router.get("/verify-email", authController.verifyEmail);

// Gửi lại email xác thực
router.post("/resend-verification", authController.resendVerification);

// Đăng nhập thường
router.post("/login", authController.login);

// Đăng nhập Google
router.post("/google", authController.googleLogin);

// Quên mật khẩu
router.post("/forgot-password", authController.forgotPassword);

// Đặt lại mật khẩu
router.post("/reset-password", authController.resetPassword);

// Refresh token
router.post("/refresh", authController.refresh);

module.exports = router;
