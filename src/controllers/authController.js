const authService = require("../services/authService");
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
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(
      req.body.email,
      req.body.matKhau
    );
    res.json({ user, accessToken, refreshToken }); // Bỏ refreshToken nếu không dùng
  } catch (err) {
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

// Bỏ logout

module.exports = { register, login, refresh };
