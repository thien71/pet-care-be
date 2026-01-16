// src/controllers/authController.js
const authService = require("../services/authService");
const Joi = require("joi");

// ==================== SCHEMAS ====================
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  matKhau: Joi.string().min(6).required(),
  hoTen: Joi.string().required(),
  maVaiTro: Joi.number().default(1),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  matKhau: Joi.string().required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verifyOTPSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

// ==================== CONTROLLERS ====================

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  console.log("Register controller hit");
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("Register error:", err.message);
    next(err);
  }
}

/**
 * POST /api/auth/verify-otp
 * Body: { email, otp }
 */
async function verifyOTP(req, res, next) {
  console.log("Verify OTP controller hit");
  const { error } = verifyOTPSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { email, otp } = req.body;
    const result = await authService.verifyEmailWithOTP(email, otp);
    res.json(result);
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    next(err);
  }
}

/**
 * POST /api/auth/resend-otp
 * Body: { email }
 */
async function resendOTP(req, res, next) {
  console.log("Resend OTP controller hit");
  const { error } = emailSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const result = await authService.resendVerificationOTP(req.body.email);
    res.json(result);
  } catch (err) {
    console.error("Resend OTP error:", err.message);
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  console.log("Login controller hit");
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const result = await authService.loginUser(req.body.email, req.body.matKhau);
    res.json(result);
  } catch (err) {
    console.error("Login error:", err.message);
    next(err);
  }
}

/**
 * POST /api/auth/google
 */
async function googleLogin(req, res, next) {
  try {
    const { googleProfile } = req.body;

    if (!googleProfile || !googleProfile.email) {
      return res.status(400).json({ message: "Thông tin Google không hợp lệ" });
    }

    const result = await authService.loginWithGoogle(googleProfile);
    res.json(result);
  } catch (err) {
    console.error("Google login error:", err.message);
    next(err);
  }
}

/**
 * POST /api/auth/forgot-password
 */
async function forgotPassword(req, res, next) {
  const { error } = emailSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const result = await authService.forgotPassword(req.body.email);
    res.json(result);
  } catch (err) {
    console.error("Forgot password error:", err.message);
    next(err);
  }
}

/**
 * POST /api/auth/reset-password
 */
async function resetPassword(req, res, next) {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const result = await authService.resetPassword(req.body.token, req.body.newPassword);
    res.json(result);
  } catch (err) {
    console.error("Reset password error:", err.message);
    next(err);
  }
}

/**
 * POST /api/auth/refresh
 */
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const { accessToken } = authService.refreshAccessToken(refreshToken);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  refresh,
};
