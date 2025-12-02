const authService = require("../services/authService"); // Đổi tên file
const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  matKhau: Joi.string().min(6).required(),
  hoTen: Joi.string().required(),
  maVaiTro: Joi.number().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  matKhau: Joi.string().required(),
});

async function register(req, res, next) {
  console.log("🎯 Register controller hit");
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    next(err);
  }
}

async function login(req, res, next) {
  console.log("🎯 Login controller hit");
  console.log("📥 Request body:", req.body);

  const { error } = loginSchema.validate(req.body);
  if (error) {
    console.log("❌ Validation error:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    console.log("✅ Validation passed");
    const result = await authService.loginUser(
      req.body.email,
      req.body.matKhau
    );
    console.log("🎉 Login successful");
    res.json(result);
  } catch (err) {
    console.error("💥 Login error:", err.message);
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const { accessToken } = authService.refreshAccessToken(refreshToken);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh };
